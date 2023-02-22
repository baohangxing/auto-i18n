import type {
  SFCScriptBlock,
  SFCTemplateBlock,
} from '@vue/compiler-sfc'
import { parse } from '@vue/compiler-sfc'
import * as htmlparser2 from 'htmlparser2'
import mustache from 'mustache'
import ejs from 'ejs'
import type { Collector, I18nCallRule, Log } from '../types'
import { includeChinese } from '../utils/help'
import { IGNORE_REMARK, VUE_COMMENT_TYPE } from '../config/constants'
import transformJs from './transformJs'
import { initTsxParse } from './parse'
import {
  escapeQuotes,
  getCallExpression,
  getCallExpressionPrefix,
  getFileComment,
  getWrapperTemplate,
  mergeCode,
  trimValue,
} from './tools'

interface TransformVueOptions {
  rule: I18nCallRule

  replace: boolean

  loger?: Log<any>

  collector: Collector
}

type Handler = (source: string, options: TransformVueOptions,) => string

const handleTemplate = (code: string, options: TransformVueOptions): string => {
  let htmlString = ''

  const collector = options.collector

  const getReplaceValue = (value: string): string => {
    value = escapeQuotes(value)
    return getCallExpression(options.rule, collector.getKey(value))
  }

  const parseJsSyntax = (source: string): string => {
    // vue属性有可能是{xx:xx}这种对象形式，直接解析会报错，需要特殊处理。
    // 先处理成temp = {xx:xx} 让babel解析，解析完再还原成{xx:xx}
    let isObjectStruct = false
    if (source.startsWith('{') && source.endsWith('}')) {
      isObjectStruct = true
      source = `___temp = ${source}`
    }
    const { code } = transformJs(source,
      {
        rule: options.rule,
        parse: initTsxParse(),
        replace: options.replace,
        collector: options.collector,
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
          const isVueDirective = key.startsWith(':') || key.startsWith('@') || key.startsWith('v-')
          if (includeChinese(attrValue) && isVueDirective) {
            const source = parseJsSyntax(attrValue)
            // 处理属性类似于:xx="'xx'"，这种属性值不是js表达式的情况
            // attrValue === source即属性值不是js表达式
            // attrValue.startsWith是为了排除:xx="t('中文')"的情况
            if (attrValue === source && !attrValue.startsWith(getCallExpressionPrefix(options.rule))) {
              collector.add(removeQuotes(attrValue))
              if (options.replace)
                attrs += ` ${key}="${getReplaceValue(removeQuotes(attrValue))}"`
            }
            else {
              attrs += ` ${key}="${source}"`
            }
          }
          else if (includeChinese(attrValue) && !isVueDirective) {
            collector.add(attrValue)
            if (options.replace)
              attrs += ` :${key}="${getReplaceValue(attrValue)}"`
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
          let value = token[1]

          if (includeChinese(value)) {
            value = trimValue(value)
            if (type === 'text') {
              collector.add(value)
              if (options.replace)
                str += `{{${getReplaceValue(value)}}}`
            }
            else if (type === 'name') {
              const source = parseJsSyntax(value)
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

const handleScript = (source: string, options: TransformVueOptions): string => {
  const { code } = transformJs(source, {
    rule: options.rule,
    replace: options.replace,
    isJsInVue: true,
    parse: initTsxParse(),
    collector: options.collector,
  })
  return `\n${code}\n`
}

const generateSource = (
  sfcBlock: SFCTemplateBlock | SFCScriptBlock,
  handler: Handler,
  options: TransformVueOptions,
): string => {
  const wrapperTemplate = getWrapperTemplate(sfcBlock)
  const source = handler(sfcBlock.content, options)
  return ejs.render(wrapperTemplate, {
    code: source,
  })
}

const transformVue = (
  code: string,
  options: TransformVueOptions,
): {
  code: string
} => {
  const { descriptor, errors } = parse(code)
  if (errors.length > 0) {
    options.loger?.error('Parse vue error', errors)
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
    templateCode = generateSource(template, handleTemplate, options)

  if (script)
    scriptCode = generateSource(script, handleScript, options)

  if (scriptSetup)
    scriptSetupCode = generateSource(scriptSetup, handleScript, options)

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

export type { TransformVueOptions }
