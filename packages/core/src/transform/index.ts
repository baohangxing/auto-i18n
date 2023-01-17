import presetTypescript from '@babel/preset-typescript'
import type { FileExtension, I18nCallRules } from '../types'
import log from '../utils/log'
import transformJs from './transformJs'
import transformVue from './transformVue'
import { initParse } from './parse'

function transform(
  code: string,
  ext: FileExtension,
  rules: I18nCallRules,
): {
    code: string
  } {
  switch (ext) {
    case 'cjs':
    case 'mjs':
    case 'js':
    case 'jsx':
      return transformJs(code, {
        rule: rules[ext],
        parse: initParse(),
      })
    case 'ts':
    case 'tsx':
      return transformJs(code, {
        rule: rules[ext],
        parse: initParse([[presetTypescript, { isTSX: true, allExtensions: true }]]),
      })
    case 'vue':
      return transformVue(code, rules[ext])
    default:
      log.error(`not support transform .${ext} extension`)
      return { code }
  }
}

export { transform }
