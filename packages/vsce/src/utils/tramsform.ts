import {
  KeyCollector,
  initJsParse,
  initTsxParse,
  transformJs,
  transformVue,
} from '@yostar/auto-i18n-core'
import type { FileExtension } from '@yostar/auto-i18n-core'
import * as fsExtra from 'fs-extra'
import logger from './logger'
import { getAutoBaseConfigBindWorkspace, getJsonPathBindWorkspace } from './tools'

const transform = (
  code: string,
  ext: FileExtension,
  replace = true,
): {
  code: string
} => {
  const { baseLangJson } = getJsonPathBindWorkspace()
  if (!baseLangJson?.path) {
    return {
      code: '',
    }
  }
  const baseLangJsonObj = fsExtra.readJsonSync(baseLangJson.path)

  const collector = new KeyCollector(baseLangJsonObj, logger)
  collector.init()

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
