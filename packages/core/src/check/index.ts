import { createRequire } from 'module'
import type { NodePath } from '@babel/traverse'
import type {
  CallExpression,
} from '@babel/types'
import type * as traverseType from '@babel/traverse/index'
import { parse } from '@vue/compiler-sfc'
import * as htmlparser2 from 'htmlparser2'
import mustache from 'mustache'
import type { ParseResult } from '@babel/core'
import type { I18nCallRule, Log } from '../types'
import { IGNORE_REMARK } from '../config/constants'
import { trimValue } from '../transform/tools'
import { initTsxParse } from '../transform/parse'

interface GetI18nKeysOptions {
  rule: I18nCallRule
  parse: (code: string) => ParseResult | null

  logger?: Log<any>
}

const require = createRequire(import.meta.url)
// see https://github.com/babel/babel/issues/13855
const traverse: typeof traverseType.default = require('@babel/traverse').default

const getJsI18nKeys = (code: string, options: GetI18nKeysOptions): string[] => {
  const rule = options.rule

  const res = new Set<string>()

  const checkAST = (code: string, options: GetI18nKeysOptions) => {
    function getTraverseOptions() {
      return {

        CallExpression(path: NodePath<CallExpression>) {
          const { node } = path
          const { transCaller, transIdentifier } = rule
          const callee = node.callee

          let mayIsArguments = false

          // 无调用对象的情况，例如 t('xx')
          if (!transCaller && callee.type === 'Identifier' && callee.name === transIdentifier)
            mayIsArguments = true

          // 有调用对象的情况，例如this.$t('xx')、i18n.$t('xx')
          if (callee.type === 'MemberExpression') {
            if (callee.property && callee.property.type === 'Identifier') {
              if (callee.property.name === transIdentifier) {
                // 处理形如i18n.$t('xx')的情况
                if (callee.object.type === 'Identifier' && callee.object.name === transCaller)
                  mayIsArguments = true

                // 处理形如this.$t('xx')的情况
                if (callee.object.type === 'ThisExpression' && transCaller === 'this')
                  mayIsArguments = true
              }
            }
          }

          if (mayIsArguments && node.arguments[0]) {
            if (node.arguments[0].type === 'StringLiteral')
              res.add(node.arguments[0].value)

            if (node.arguments[0].type === 'TemplateLiteral'
              && node.arguments[0].expressions.length === 0
              && node.arguments[0].quasis?.[0].value.raw !== '')
              res.add(node.arguments[0].quasis[0].value.raw)
          }
        },
      }
    }

    const ast = options.parse(code)
    traverse(ast, getTraverseOptions())
    return ast
  }

  checkAST(code, options)

  return [...res]
}

const getJsSyntaxI18nKeys = (source: string, options: GetI18nKeysOptions): string[] => {
  if (source.startsWith('{') && source.endsWith('}'))
    source = `___temp = ${source}`

  return getJsI18nKeys(source,
    {
      rule: {
        ...options.rule,
        variableDeclaration: '',
        importDeclaration: '',
      },
      parse: initTsxParse(),
      logger: options.logger,
    },
  )
}

const getTemplateKeys = (code: string, options: GetI18nKeysOptions): string[] => {
  const res: string [] = []

  let shouldIgnore = false
  const parser = new htmlparser2.Parser(
    {
      onopentag(tagName, attributes) {
        if (shouldIgnore)
          return

        for (const key in attributes) {
          const attrValue = attributes[key]
          // v-for 的 vue自定义语法无法用 getJsSyntaxI18nKeys
          const isVueDirective = key.startsWith(':') || key.startsWith('@')
            || (key.startsWith('v-') && !key.startsWith('v-for'))
          if (isVueDirective) {
            const keys = getJsSyntaxI18nKeys(attrValue, options)
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
            const keys = getJsSyntaxI18nKeys(value, options)
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

const getScriptKeys = (source: string, options: GetI18nKeysOptions): string[] => {
  return getJsI18nKeys(source, options)
}

const getVueI18nKeys = (
  code: string,
  options: GetI18nKeysOptions,
): string[] => {
  const { descriptor, errors } = parse(code)
  if (errors.length > 0) {
    options.logger?.error('Parse vue error', errors)
    return []
  }

  const res = new Set<string>()

  const { template, script, scriptSetup } = descriptor

  if (template) {
    const keys = getTemplateKeys(template.content, options)
    for (const x of keys)
      res.add(x)
  }

  if (script) {
    const keys = getScriptKeys(script.content, options)
    for (const x of keys)
      res.add(x)
  }

  if (scriptSetup) {
    const keys = getScriptKeys(scriptSetup.content, options)
    for (const x of keys)
      res.add(x)
  }

  return [...res]
}

export { getJsI18nKeys, getVueI18nKeys }
export type { GetI18nKeysOptions }
