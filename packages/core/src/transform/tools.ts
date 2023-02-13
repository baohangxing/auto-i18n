import type { StringLiteral } from '@babel/types'
import t from '@babel/types'
import type { SFCDescriptor, SFCScriptBlock, SFCStyleBlock, SFCTemplateBlock } from '@vue/compiler-sfc'
import type { I18nCallRule } from '../types'

const getCallExpression = (rule: I18nCallRule, identifier: string, quote = '\''): string => {
  const { transCaller, transIdentifier } = rule
  const transCallerName = transCaller ? `${transCaller}.` : ''
  const expression = `${transCallerName}${transIdentifier}(${quote}${identifier}${quote})`
  return expression
}

const getStringLiteral = (value: string): StringLiteral => {
  return Object.assign(t.stringLiteral(value), {
    extra: {
      raw: `'${value}'`,
      rawValue: value,
    },
  })
}

const getCallExpressionPrefix = (rule: I18nCallRule): string => {
  const { transCaller, transIdentifier } = rule
  const transCallerName = transCaller ? `${transCaller}.` : ''
  return `${transCallerName}${transIdentifier}(`
}

const trimValue = (value: string): string => {
  value = value.trim()
  if (value.startsWith('\n'))
    value = value.slice(1).trimStart()

  if (value.endsWith('\n'))
    value = value.slice(0, value.length - 1).trimEnd()

  return value
}

const escapeQuotes = (value: string): string => {
  return value.replaceAll('\'', '\\\'').replaceAll('"', '\\"')
}

const mergeCode = (templateCode: string, scriptCode: string,
  scriptSetupCode: string, stylesCode: string): string => {
  return `${templateCode}${templateCode ? '\n\n' : ''}${scriptCode}${scriptCode ? '\n\n' : ''}`
    + `${scriptSetupCode}${scriptSetupCode ? '\n\n' : ''}${stylesCode}`
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

export {
  getStringLiteral,
  getCallExpression,
  getCallExpressionPrefix,
  escapeQuotes,
  trimValue,
  mergeCode,
  getWrapperTemplate,
  getFileComment,
}
