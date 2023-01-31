import { createRequire } from 'module'
import type { NodePath } from '@babel/traverse'
import type {
  CallExpression,
} from '@babel/types'
import type * as traverseType from '@babel/traverse/index'

import { parse } from '@vue/compiler-sfc'
import * as htmlparser2 from 'htmlparser2'
import mustache from 'mustache'
import presetTypescript from '@babel/preset-typescript'
import { getAutoConfig } from '../config/config'
import type { I18nCallRule, transformOptions } from '../types'
import log from '../utils/log'
import { IGNORE_REMARK } from '../config/constants'
import { trimValue } from '../transform/tools'
import { initParse } from '../transform/parse'

const require = createRequire(import.meta.url)
// see https://github.com/babel/babel/issues/13855
const traverse: typeof traverseType.default = require('@babel/traverse').default

const getAppendI18nKeysUsed = (code: string): string[] => {
  const autoConfig = getAutoConfig()
  const rxI18Keys = autoConfig.checkUsageMatchAppend ?? []
  let m: any

  const keys = new Set<string>()

  for (const rxStr of rxI18Keys) {
    const rx = new RegExp(rxStr)
    // eslint-disable-next-line no-cond-assign
    while ((m = rx.exec(code)) !== null) {
      if (m.index === rx.lastIndex)
        rx.lastIndex++

      if (m[1])
        keys.add(m[1])
    }
  }

  return [...keys]
}

const checkJs = (code: string, options: transformOptions): string[] => {
  const rule = options.rule

  const res = new Set<string>()

  const checkAST = (code: string, options: transformOptions) => {
    function getTraverseOptions() {
      return {

        CallExpression(path: NodePath<CallExpression>) {
          const { node } = path
          const { transCaller, transIdentifier } = rule
          const callee = node.callee

          // 无调用对象的情况，例如 t('xx')
          if (!transCaller && callee.type === 'Identifier' && callee.name === transIdentifier) {
            if (node.arguments[0] && node.arguments[0].type === 'StringLiteral')
              res.add(node.arguments[0].value)
          }

          // 有调用对象的情况，例如this.$t('xx')、i18n.$t('xx')
          if (callee.type === 'MemberExpression') {
            if (callee.property && callee.property.type === 'Identifier') {
              if (callee.property.name === transIdentifier) {
                // 处理形如i18n.$t('xx')的情况
                if (callee.object.type === 'Identifier' && callee.object.name === transCaller) {
                  if (node.arguments[0] && node.arguments[0].type === 'StringLiteral')
                    res.add(node.arguments[0].value)
                }
                // 处理形如this.$t('xx')的情况
                if (callee.object.type === 'ThisExpression' && transCaller === 'this') {
                  if (node.arguments[0] && node.arguments[0].type === 'StringLiteral')
                    res.add(node.arguments[0].value)
                }
              }
            }
          }
        },

      }
    }

    const ast = options.parse(code)
    traverse(ast, getTraverseOptions())
    return ast
  }

  checkAST(code, options)

  const appendKeys = getAppendI18nKeysUsed(code)

  for (const x of appendKeys)
    res.add(x)

  return [...res]
}

const checkJsSyntax = (source: string, rule: I18nCallRule): string[] => {
  if (source.startsWith('{') && source.endsWith('}'))
    source = `___temp = ${source}`

  return checkJs(source, {
    rule: {
      ...rule,
      variableDeclaration: '',
      importDeclaration: '',
    },
    parse: initParse([[presetTypescript, { isTSX: true, allExtensions: true }]]),
  })
}

const checkTemplate = (code: string, rule: I18nCallRule): string[] => {
  const res: string [] = []

  let shouldIgnore = false
  const parser = new htmlparser2.Parser(
    {
      onopentag(tagName, attributes) {
        if (shouldIgnore)
          return

        for (const key in attributes) {
          const attrValue = attributes[key]
          const isVueDirective = key.startsWith(':') || key.startsWith('@') || key.startsWith('v-')
          if (isVueDirective) {
            const keys = checkJsSyntax(attrValue, rule)
            res.push(...keys)
          }
        }
      },

      ontext(text) {
        if (shouldIgnore)
          return

        const tokens = mustache.parse(text)
        for (const token of tokens) {
          const type = token[0]
          let value = token[1]

          value = trimValue(value)
          if (type === 'name') {
            const keys = checkJsSyntax(value, rule)
            res.push(...keys)
          }
        }
      },
      onclosetag() {
        shouldIgnore = false
      },
      oncomment(comment) {
        if (comment.includes(IGNORE_REMARK))
          shouldIgnore = true
      },
    },
    {
      lowerCaseTags: false,
      recognizeSelfClosing: true,
      lowerCaseAttributeNames: false,
    },
  )

  parser.write(code)
  parser.end()
  return res
}

const checkScript = (source: string, rule: I18nCallRule): string[] => {
  return checkJs(source, {
    rule,
    isJsInVue: true,
    parse: initParse([[presetTypescript, { isTSX: true, allExtensions: true }]]),
  })
}

const checkVue = (
  code: string,
  rule: I18nCallRule,
): string[] => {
  const { descriptor, errors } = parse(code)
  if (errors.length > 0) {
    log.error('parse vue error', errors[0].toString())
    return []
  }

  const res = new Set<string>()

  const { template, script, scriptSetup } = descriptor

  if (template) {
    const keys = checkTemplate(template.content, rule)
    for (const x of keys)
      res.add(x)
  }

  if (script) {
    const keys = checkScript(script.content, rule)
    for (const x of keys)
      res.add(x)
  }

  if (scriptSetup) {
    const keys = checkScript(scriptSetup.content, rule)
    for (const x of keys)
      res.add(x)
  }

  const appendKeys = getAppendI18nKeysUsed(code)

  for (const x of appendKeys)
    res.add(x)

  return [...res]
}

export { checkJs, checkVue }
