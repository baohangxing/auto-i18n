import {
  initJsParse,
  initTsxParse,
  transformJs,
  transformVue,
} from '@h1mple/auto-i18n-core'
import type {
  FileExtension,

  KeyCollector,
} from '@h1mple/auto-i18n-core'
import logger from './logger'
import { getAutoBaseConfigBindWorkspace } from './tools'

const transform = (
  code: string,
  ext: FileExtension,
  collector: KeyCollector,
  replace = true,
): {
  code: string
} => {
  const autoConfig = getAutoBaseConfigBindWorkspace()

  const rules = autoConfig.i18nCallRules

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
      logger.error(`Not support transform .${ext} extension`)
      return { code }
  }
}

export { transform }
