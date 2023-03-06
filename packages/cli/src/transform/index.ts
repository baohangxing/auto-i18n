import { initJsParse, initTsxParse, transformJs, transformVue } from '@yostar/auto-i18n-core'
import type { Collector, FileExtension, I18nCallRules, Log } from '@yostar/auto-i18n-core'
import log from '../utils/log'
import type { AutoConfig } from '../types'

const transform = (
  code: string,
  ext: FileExtension,
  rules: I18nCallRules,
  collector: Collector,
  logger: Log<any>,
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
        logger,
        autoConfig,
      })
    case 'ts':
    case 'tsx':
      return transformJs(code, {
        rule: rules[ext],
        parse: initTsxParse(),
        collector,
        replace,
        logger,
        autoConfig,
      })
    case 'vue':
      return transformVue(code, {
        rule: rules[ext],
        collector,
        replace,
        logger,
        autoConfig,
      })
    default:
      log.error(`Not support transform .${ext} extension`)
      return { code }
  }
}

export { transform }
