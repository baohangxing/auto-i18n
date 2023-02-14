import type {
  SFCScriptBlock,
  SFCTemplateBlock,
} from '@vue/compiler-sfc'
import { parse } from '@vue/compiler-sfc'
import * as htmlparser2 from 'htmlparser2'
import mustache from 'mustache'
import ejs from 'ejs'
import type { I18nCallRule } from '../types'
import { includeChinese } from '../utils/help'
import log from '../utils/log'
import { IGNORE_REMARK, VUE_COMMENT_TYPE } from '../config/constants'
import transformJs from './transformJs'
import { initTsxParse } from './parse'
import Collector from './collector'
import {
  escapeQuotes,
  getCallExpression,
  getCallExpressionPrefix,
  getFileComment,
  getWrapperTemplate,
  mergeCode,
  trimValue,
} from './tools'

type Handler = (source: string, rule: I18nCallRule, replace: boolean) => string

const parseJsSyntax = (source: string, rule: I18nCallRule): string => {
  // vue属性有可能是{xx:xx}这种对象形式，直接解析会报错，需要特殊处理。
  // 先处理成temp = {xx:xx} 让babel解析，解析完再还原成{xx:xx}
  let isObjectStruct = false
  if (source.startsWith('{') && source.endsWith('}')) {
    isObjectStruct = true
    source = `___temp = ${source}`
  }
  const { code } = transformJs(source, {
    rule: {
      ...rule,
      variableDeclaration: '',
      importDeclaration: '',
    },
    parse: initTsxParse(),
  })

  let stylizedCode = code

  if (isObjectStruct)
    stylizedCode = stylizedCode.replace('___temp = ', '')

  stylizedCode = stylizedCode.replace(/;$/gm, '')
  return stylizedCode.endsWith('\n') ? stylizedCode.slice(0, stylizedCode.length - 1) : stylizedCode
}

const removeQuotes = (value: string): string => {
  if (['"', '\''].includes(value.charAt(0)) && ['"', '\''].includes(value.charAt(value.length - 1)))
    value = value.substring(1, value.length - 1)

  return value
}

const handleTemplate = (code: string, rule: I18nCallRule, replace = true): string => {
  let htmlString = ''

  const getReplaceValue = (value: string): string => {
    value = escapeQuotes(value)
    return getCallExpression(rule, Collector.getKey(value))
  }

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
                log.verbose(`pleace check the changing of attributes: ${key}="${attrValue}"`)
                attrs += ` ${key}="${attrValue}"`
              }
              else {
                log.verbose(`pleace check the changing of attributes: ${key}`)
                attrs += ` ${key}`
              }
            }
          }
          htmlString += `<${tagName}${attrs}>`
          return
        }
        for (const key in attributes) {
          const attrValue = attributes[key]
          const isVueDirective = key.startsWith(':') || key.startsWith('@') || key.startsWith('v-')
          if (includeChinese(attrValue) && isVueDirective) {
            const source = parseJsSyntax(attrValue, rule)
            // 处理属性类似于:xx="'xx'"，这种属性值不是js表达式的情况
            // attrValue === source即属性值不是js表达式
            // attrValue.startsWith是为了排除:xx="t('中文')"的情况
            if (attrValue === source && !attrValue.startsWith(getCallExpressionPrefix(rule))) {
              Collector.add(removeQuotes(attrValue))
              if (replace)
                attrs += ` ${key}="${getReplaceValue(removeQuotes(attrValue))}"`
            }
            else {
              attrs += ` ${key}="${source}"`
            }
          }
          else if (includeChinese(attrValue) && !isVueDirective) {
            Collector.add(attrValue)
            if (replace)
              attrs += ` :${key}="${getReplaceValue(attrValue)}"`
          }
          else if (attrValue === '') {
            if (key.match(/^[@]/)) {
              log.verbose(`pleace check the changing of attributes: ${key}="${attrValue}"`)
              attrs += ` ${key}="${attrValue}"`
            }
            else {
              log.verbose(`pleace check the changing of attributes: ${key}`)
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
          let value = token[1]

          if (includeChinese(value)) {
            value = trimValue(value)
            if (type === 'text') {
              Collector.add(value)
              if (replace)
                str += `{{${getReplaceValue(value)}}}`
            }
            else if (type === 'name') {
              const source = parseJsSyntax(value, rule)
              str += `{{${source}}}`
            }
          }
          else {
            if (type === 'text') {
              str += value
            }
            else if (type === 'name') {
              str += `{{${value}}}`
            }
            else if (type === VUE_COMMENT_TYPE) {
              // 形如{{!xxxx}}这种形式，在mustache里属于注释语法
              str += `{{!${value}}}`
            }
          }
        }

        htmlString += str
      },

      onclosetag(tagName, isImplied) {
        shouldIgnore = false
        // 如果是自闭合标签
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
      // xmlMode: true,
    },
  )

  parser.write(code)
  parser.end()
  return htmlString
}

const handleScript = (source: string, rule: I18nCallRule, replace: boolean): string => {
  const { code } = transformJs(source, {
    rule,
    isJsInVue: true,
    parse: initTsxParse(),
  },
  replace)
  return `\n${code}\n`
}

const generateSource = (
  sfcBlock: SFCTemplateBlock | SFCScriptBlock,
  handler: Handler,
  rule: I18nCallRule,
  replace: boolean,
): string => {
  const wrapperTemplate = getWrapperTemplate(sfcBlock)
  const source = handler(sfcBlock.content, rule, replace)
  return ejs.render(wrapperTemplate, {
    code: source,
  })
}

const transformVue = (
  code: string,
  rule: I18nCallRule,
  replace = true,
): {
  code: string
} => {
  const { descriptor, errors } = parse(code)
  if (errors.length > 0) {
    log.error('Parse vue error', errors)
    return {
      code,
    }
  }

  const { template, script, scriptSetup, styles } = descriptor
  let templateCode = ''
  let scriptCode = ''
  let stylesCode = ''
  let scriptSetupCode = ''
  const fileComment = getFileComment(descriptor)

  if (template)
    templateCode = generateSource(template, handleTemplate, rule, replace)

  if (script)
    scriptCode = generateSource(script, handleScript, rule, replace)

  if (scriptSetup)
    scriptSetupCode = generateSource(scriptSetup, handleScript, rule, replace)

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

  return {
    code,
  }
}

export default transformVue
