import type { I18nCallRule } from '../types'

const getCallExpression = (rule: I18nCallRule, identifier: string, quote = '\''): string => {
  const { transCaller, transIdentifier } = rule
  const transCallerName = transCaller ? `${transCaller}.` : ''
  const expression = `${transCallerName}${transIdentifier}(${quote}${identifier}${quote})`
  return expression
}

const getCallExpressionPrefix = (rule: I18nCallRule): string => {
  const { transCaller, transIdentifier } = rule
  const transCallerName = transCaller ? `${transCaller}.` : ''
  return `${transCallerName}${transIdentifier}(`
}

const trimValue = (value: string): string => {
  value = value.trim()
  if (value.startsWith('\n'))
    value = value.slice(1, value.length - 1).trimStart()

  if (value.endsWith('\n'))
    value = value.slice(0, value.length - 1)

  return value
}

const escapeQuotes = (value: string): string => {
  return value.replaceAll('\'', '\\\'').replaceAll('"', '\\"')
}

export { getCallExpression, getCallExpressionPrefix, escapeQuotes, trimValue }
