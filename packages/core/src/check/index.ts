import presetTypescript from '@babel/preset-typescript'
import { initParse } from '../transform/parse'
import type { FileExtension, I18nCallRules } from '../types'
import log from '../utils/log'
import { checkJs, checkVue } from './checkHelp'

const checkTranslated = (
  code: string,
  ext: FileExtension,
  rules: I18nCallRules,
): string[] => {
  switch (ext) {
    case 'cjs':
    case 'mjs':
    case 'js':
    case 'jsx':
      return checkJs(code, {
        rule: rules[ext],
        parse: initParse(),
      })
    case 'ts':
    case 'tsx':
      return checkJs(code, {
        rule: rules[ext],
        parse: initParse([[presetTypescript, { isTSX: true, allExtensions: true }]]),
      })
    case 'vue':
      return checkVue(code, rules[ext])
    default:
      log.error(`not support check .${ext} extension`)
      return []
  }
}

export { checkTranslated }
