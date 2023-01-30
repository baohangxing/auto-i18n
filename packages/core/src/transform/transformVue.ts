import type {
  SFCDescriptor,
  SFCScriptBlock,
  SFCStyleBlock,
  SFCTemplateBlock,
} from '@vue/compiler-sfc'
import { parse } from '@vue/compiler-sfc'
import * as htmlparser2 from 'htmlparser2'
import mustache from 'mustache'
import ejs from 'ejs'
import presetTypescript from '@babel/preset-typescript'
import type { I18nCallRule } from '../types'
import { includeChinese } from '../utils/help'
import log from '../utils/log'
import { IGNORE_REMARK } from '../config/constants'
import transformJs from './transformJs'
import { initParse } from './parse'
import Collector from './collector'
import { escapeQuotes, getCallExpression, getCallExpressionPrefix, trimValue } from './tools'

type Handler = (source: string, rule: I18nCallRule, replace: boolean) => string

const COMMENT_TYPE = '!'

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
    parse: initParse([[presetTypescript, { isTSX: true, allExtensions: true }]]),
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
            attrs += ` ${key}="${attrValue}" `
          }
          htmlString += `<${tagName} ${attrs}>`
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
            attrs += ` ${key}`
          }
          else {
            attrs += ` ${key}="${attrValue}"`
          }
        }
        htmlString += `<${tagName} ${attrs}>`
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
            else if (type === COMMENT_TYPE) {
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
          htmlString = `${htmlString.slice(0, htmlString.length - 2)}/>`
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
    parse: initParse([[presetTypescript, { isTSX: true, allExtensions: true }]]),
  },
  replace)
  return `\n${code}\n`
}

const mergeCode = (templateCode: string, scriptCode: string, stylesCode: string): string => {
  return `${templateCode}\n${scriptCode}\n${stylesCode}`
}

const getWrapperTemplate = (sfcBlock: SFCTemplateBlock | SFCScriptBlock | SFCStyleBlock): string => {
  const { type, lang, attrs } = sfcBlock
  let template = `<${type}`

  if (lang)
    template += ` lang="${lang}"`

  if ((sfcBlock as SFCScriptBlock).setup)
    template += ' setup'

  if ((sfcBlock as SFCStyleBlock).scoped)
    template += ' scoped'

  for (const attr in attrs) {
    if (!['lang', 'scoped', 'setup'].includes(attr))
      template += ` ${attr}="${attrs[attr]}"`
  }
  template += `><%- code %></${type}>`
  return template
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

const removeSnippet = (
  source: string,
  sfcBlock: SFCTemplateBlock | SFCScriptBlock | SFCStyleBlock | null,
): string => {
  return sfcBlock ? source.replace(sfcBlock.content, '') : source
}

/**
 * 提取文件头注释 //TODO fix in 1.0.0
 * @param descriptor
 * @returns
 */
const getFileComment = (descriptor: SFCDescriptor): string => {
  const { template, script, scriptSetup, styles } = descriptor
  let source = descriptor.source
  source = removeSnippet(source, template)
  source = removeSnippet(source, script)
  source = removeSnippet(source, scriptSetup)
  if (styles) {
    for (const style of styles)
      source = removeSnippet(source, style)
  }
  const result = source.match(/<!--[\s\S]*?-->/m)
  return result ? result[0] : ''
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
    log.error('parse vue error', errors[0].toString())
    return {
      code,
    }
  }

  const { template, script, scriptSetup, styles } = descriptor
  let templateCode = ''
  let scriptCode = ''
  let stylesCode = ''

  const fileComment = getFileComment(descriptor)

  if (template)
    templateCode = generateSource(template, handleTemplate, rule, replace)

  if (script)
    scriptCode = generateSource(script, handleScript, rule, replace)

  if (scriptSetup)
    scriptCode = generateSource(scriptSetup, handleScript, rule, replace)

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

  code = mergeCode(templateCode, scriptCode, stylesCode)
  if (fileComment)
    code = `${fileComment}\n${code}`

  return {
    code,
  }
}

export default transformVue
