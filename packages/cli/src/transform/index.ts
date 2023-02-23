import { initJsParse, initTsxParse, transformJs, transformVue } from '@h1mple/auto-i18n-core'
import type { Collector, FileExtension, I18nCallRules, Log } from '@h1mple/auto-i18n-core'
import log from '../utils/log'
import type { AutoConfig } from '../types'

const transform = (
  code: string,
  ext: FileExtension,
  rules: I18nCallRules,
  collector: Collector,
  loger: Log<any>,
  autoConfig: AutoConfig,
  replace = true,
): {
  code: string
} => {
  switch (ext) {
    case 'cjs':
    case 'mjs':
    case 'js':
    case 'jsx':
      return transformJs(code, {
        rule: rules[ext],
        parse: initJsParse(),
        collector,
        replace,
        loger,
        autoConfig,
      })
    case 'ts':
    case 'tsx':
      return transformJs(code, {
        rule: rules[ext],
        parse: initTsxParse(),
        collector,
        replace,
        loger,
        autoConfig,
      })
    case 'vue':
      return transformVue(code, {
        rule: rules[ext],
        collector,
        replace,
        loger,
        autoConfig,
      })
    default:
      log.error(`Not support transform .${ext} extension`)
      return { code }
  }
}

export { transform }
