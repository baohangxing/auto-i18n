import { createRequire } from 'module'
import type { NodePath } from '@babel/traverse'
import type {
  CallExpression,
} from '@babel/types'
import type * as traverseType from '@babel/traverse/index'
import type { ParseResult } from '@babel/core'
import type { SFCScriptBlock, SFCTemplateBlock } from '@vue/compiler-sfc'
import { parse } from '@vue/compiler-sfc'
import * as htmlparser2 from 'htmlparser2'
import mustache from 'mustache'
import presetTypescript from '@babel/preset-typescript'
import fsExtra from 'fs-extra'
import type * as generatorType from '@babel/generator/index'
import ejs from 'ejs'
import { getJsonPath } from '../config/config'
import type { I18nCallRule, Log } from '../types'
import { IGNORE_REMARK, VUE_COMMENT_TYPE } from '../config/constants'
import { getFileComment, getStringLiteral, getWrapperTemplate, mergeCode } from '../transform/tools'
import { initJsParse, initTsxParse } from '../transform/parse'
import { getValueByKey } from '../utils/help'

type Handler = (source: string, options: RevertOptions,) => string

interface RevertOptions {
  rule: I18nCallRule
  parse: (code: string) => ParseResult | null
  locale: string
  /**
   * Whether handle js in vue
   */
  isJsInVue?: boolean

  loger?: Log<any>
}

const require = createRequire(import.meta.url)
// see https://github.com/babel/babel/issues/13855
const traverse: typeof traverseType.default = require('@babel/traverse').default
const babelGenerator: typeof generatorType.default = require('@babel/generator').default

const revertWordByKey = (locale: string) => {
  const { baseLangJson, otherLangJsons } = getJsonPath()

  let langObj: any = fsExtra.readJsonSync(baseLangJson.path)

  for (const x of otherLangJsons) {
    if (x.name === locale)
      langObj = fsExtra.readJsonSync(x.path)
  }
  return (key: string) => {
    const val = getValueByKey(langObj, key)
    return typeof val === 'string' ? val : ''
  }
}

const revertJs = (code: string, options: RevertOptions): string => {
  const rule = options.rule

  const getWordByKey = revertWordByKey(options.locale)

  const revertAST = (code: string, options: RevertOptions) => {
    function getTraverseOptions() {
      return {

        CallExpression(path: NodePath<CallExpression>) {
          const { node } = path
          const { transCaller, transIdentifier } = rule
          const callee = node.callee

          if (!transCaller && callee.type === 'Identifier' && callee.name === transIdentifier) {
            if (node.arguments[0] && node.arguments[0].type === 'StringLiteral')
              node.arguments[0] = getStringLiteral(getWordByKey(node.arguments[0].value))
            // TODO 增加参数的替换
            // TODO 去掉 callee
          }

          if (callee.type === 'MemberExpression') {
            // TODO 去掉 transCaller
            if (callee.property && callee.property.type === 'Identifier') {
              if (callee.property.name === transIdentifier) {
                if (callee.object.type === 'Identifier' && callee.object.name === transCaller) {
                  if (node.arguments[0] && node.arguments[0].type === 'StringLiteral')
                    node.arguments[0] = getStringLiteral(getWordByKey(node.arguments[0].value))
                }
                if (callee.object.type === 'ThisExpression' && transCaller === 'this') {
                  if (node.arguments[0] && node.arguments[0].type === 'StringLiteral')
                    node.arguments[0] = getStringLiteral(getWordByKey(node.arguments[0].value))
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

  const ast = revertAST(code, options)

  const result = (!ast ? code : babelGenerator(ast)) as generatorType.GeneratorResult

  return result.code
}

const revertJsSyntax = (source: string, options: RevertOptions): string => {
  let isObjectStruct = false
  if (source.startsWith('{') && source.endsWith('}')) {
    isObjectStruct = true
    source = `___temp = ${source}`
  }
  const code = revertJs(source, {
    rule: {
      ...options.rule,
      variableDeclaration: '',
      importDeclaration: '',
    },
    parse: initTsxParse(),
    loger: options.loger,
    locale: options.locale,
  })

  let stylizedCode = code

  if (isObjectStruct)
    stylizedCode = stylizedCode.replace('___temp = ', '')

  stylizedCode = stylizedCode.replace(/;$/gm, '')
  return stylizedCode.endsWith('\n') ? stylizedCode.slice(0, stylizedCode.length - 1) : stylizedCode
}

const revertTemplate = (code: string, options: RevertOptions): string => {
  let htmlString = ''

  let shouldIgnore = false

  const parser = new htmlparser2.Parser(
    {
      onopentag(tagName, attributes) {
        let attrs = ''
        if (shouldIgnore) {
          for (const key in attributes) {
            const attrValue = attributes[key]
            if (attrValue !== '') {
              attrs += ` ${key}="${attrValue}"`
            }
            else {
              if (key.match(/^[@]/)) {
                options.loger?.verbose(`pleace check the changing of attributes: ${key}="${attrValue}"`)
                attrs += ` ${key}="${attrValue}"`
              }
              else {
                options.loger?.verbose(`pleace check the changing of attributes: ${key}`)
                attrs += ` ${key}`
              }
            }
          }
          htmlString += `<${tagName}${attrs}>`
          return
        }
        for (const key in attributes) {
          const attrValue = attributes[key]
          const isVueDirective = key.startsWith(':') || key.startsWith('@')
            || (key.startsWith('v-') && !key.startsWith('v-for'))
          if (isVueDirective) {
            const source = revertJsSyntax(attrValue, options)
            attrs += ` ${key}="${source}"`
          }
          else if (attrValue === '') {
            if (key.match(/^[@]/)) {
              options.loger?.verbose(`pleace check the changing of attributes: ${key}="${attrValue}"`)
              attrs += ` ${key}="${attrValue}"`
            }
            else {
              options.loger?.verbose(`pleace check the changing of attributes: ${key}`)
              attrs += ` ${key}`
            }
          }
          else {
            attrs += ` ${key}="${attrValue}"`
          }
        }
        htmlString += `<${tagName}${attrs}>`
      },

      ontext(text) {
        if (shouldIgnore) {
          htmlString += text
          return
        }

        let str = ''
        const tokens = mustache.parse(text)
        for (const token of tokens) {
          const type = token[0]
          const value = token[1]

          if (type === 'text') {
            str += value
          }
          else if (type === 'name') {
            const source = revertJsSyntax(value, options)
            str += `{{${source}}}`
          }
          else if (type === VUE_COMMENT_TYPE) {
            // 形如{{!xxxx}}这种形式，在mustache里属于注释语法
            str += `{{!${value}}}`
          }
        }

        htmlString += str
      },
      onclosetag(tagName, isImplied) {
        shouldIgnore = false
        if (isImplied) {
          htmlString = `${htmlString.slice(0, htmlString.length - 1)}/>`
          return
        }
        htmlString += `</${tagName}>`
      },

      oncomment(comment) {
        if (comment.includes(IGNORE_REMARK))
          shouldIgnore = true

        htmlString += `<!--${comment}-->`
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
  return htmlString
}

const revertScript = (source: string, options: RevertOptions): string => {
  return revertJs(source, {
    rule: options.rule,
    isJsInVue: true,
    loger: options.loger,
    parse: initJsParse([[presetTypescript,
      { isTSX: true, allExtensions: true }]]),
    locale: options.locale,
  })
}

const generateSource = (
  sfcBlock: SFCTemplateBlock | SFCScriptBlock,
  handler: Handler,
  options: RevertOptions,
): string => {
  const wrapperTemplate = getWrapperTemplate(sfcBlock)
  const source = handler(sfcBlock.content, options)
  return ejs.render(wrapperTemplate, {
    code: source,
  })
}

const revertVue = (
  code: string,
  options: RevertOptions,
): string => {
  const { descriptor, errors } = parse(code)
  if (errors.length > 0) {
    options.loger?.error('Parse vue error', errors)
    return ''
  }

  const { template, script, scriptSetup, styles } = descriptor
  let templateCode = ''
  let scriptCode = ''
  let stylesCode = ''
  let scriptSetupCode = ''
  const fileComment = getFileComment(descriptor)

  if (template)
    templateCode = generateSource(template, revertTemplate, options)

  if (script)
    scriptCode = generateSource(script, revertScript, options)

  if (scriptSetup)
    scriptSetupCode = generateSource(scriptSetup, revertScript, options)

  if (styles) {
    for (const style of styles) {
      const wrapperTemplate = getWrapperTemplate(style)
      const source = style.content
      stylesCode
        += `${ejs.render(wrapperTemplate, {
          code: source,
        })}\n`
    }
  }

  code = mergeCode(templateCode, scriptCode, scriptSetupCode, stylesCode)
  if (fileComment)
    code = `${fileComment}\n${code}`

  return code
}

export { revertJs, revertVue }
export type { RevertOptions }
