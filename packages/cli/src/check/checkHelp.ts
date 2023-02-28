import {
  getJsI18nKeys,
  getVueI18nKeys,
  initJsParse, initTsxParse,
} from '@h1mple/auto-i18n-core'
import type { FileExtension, I18nCallRules } from '../types'

import logger from '../utils/log'

const getAppendI18nKeysUsed = (code: string, rxI18Keys: RegExp[]): string[] => {
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

const getI18nKeys = (
  code: string,
  ext: FileExtension,
  rules: I18nCallRules,
  rxI18Keys?: RegExp[],
): string[] => {
  const res: string[] = []

  switch (ext) {
    case 'cjs':
    case 'mjs':
    case 'js':
    case 'jsx':
      res.push(...getJsI18nKeys(code, {
        rule: rules[ext],
        parse: initJsParse(),
        logger,
      }))
      break
    case 'ts':
    case 'tsx':
      res.push(...getJsI18nKeys(code, {
        rule: rules[ext],
        parse: initTsxParse(),
        logger,
      }))
      break
    case 'vue':
      res.push(...getVueI18nKeys(code, {
        rule: rules[ext],
        parse: initTsxParse(),
        logger,
      }))
      break
    default:
      break
  }
  if (rxI18Keys)
    res.push(...getAppendI18nKeysUsed(code, rxI18Keys))

  return [...new Set(res)]
}

export { getI18nKeys }
