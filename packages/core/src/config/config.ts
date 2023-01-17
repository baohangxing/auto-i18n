import path from 'path'
import { cosmiconfigSync } from 'cosmiconfig'
import type { AutoConfig, LangJson } from '../types/config'
import log from '../utils/log'
import { fgSync } from '../utils/glob'
import { CLI_CONFIG_NAME } from './constants'
import defaultAutoConfig from './defaultAutoConfig'

const readLocalAutoConfig = (configPath?: string): AutoConfig | null => {
  const explorer = cosmiconfigSync(CLI_CONFIG_NAME)
  const result = configPath ? explorer.load(configPath) : explorer.search()

  if (!result?.config) {
    log.error(`Pleace add ${CLI_CONFIG_NAME} config file in your project(${process.cwd()})`)
    process.exit(1)
  }

  return result?.config
}

const getAutoConfig = (() => {
  let autoConfig: AutoConfig | null = null

  return (): AutoConfig => {
    if (autoConfig) {
      return autoConfig
    }
    else {
      autoConfig = Object.assign({}, defaultAutoConfig, readLocalAutoConfig())
      return autoConfig
    }
  }
})()

const getJsonPath = (): {
  baseLangJson: LangJson
  otherLangJsons: LangJson[]
} => {
  const autoConfig = getAutoConfig()

  let otherLangJsons: LangJson[] = []

  const files: string[] = fgSync(autoConfig.localesJsonDirs)

  for (const x of autoConfig.locales) {
    let findFlag = false
    for (const file of files) {
      if (path.parse(file).name === x) {
        findFlag = true
        otherLangJsons.push(
          {
            name: x,
            path: file,
          },
        )
        break
      }
    }
    if (!findFlag) {
      log.error(`No json file(${x}.json) in AutoConfig.localesJsonDirs: ${autoConfig.localesJsonDirs}`)
      process.exit(1)
    }
  }
  let baseLangJson: LangJson = { name: autoConfig.baseLocale, path: '' }
  if (autoConfig.baseLocale.includes(autoConfig.baseLocale)) {
    baseLangJson = otherLangJsons.find(x => x.name === autoConfig.baseLocale) as LangJson
    otherLangJsons = otherLangJsons.filter(x => x.name !== autoConfig.baseLocale)
  }
  else {
    for (const file of files) {
      if (path.parse(file).name === autoConfig.baseLocale) {
        baseLangJson.path = file
        break
      }
    }
    if (!baseLangJson.path) {
      log.error(`No base json file in AutoConfig.localesJsonDirs: ${autoConfig.localesJsonDirs}`)
      process.exit(1)
    }
  }

  return {
    baseLangJson,
    otherLangJsons,
  }
}
const isUnTransed = (str: string | null | undefined, locale: string) => {
  if (str === undefined || str === null)
    return false
  const autoConfig = getAutoConfig()
  return str.indexOf(autoConfig.untransSymbol(locale)) === 0
}

const unTransLocale = (str: string, locale: string) => {
  const autoConfig = getAutoConfig()
  return autoConfig.untransSymbol(locale) + str
}

export { getAutoConfig, getJsonPath, isUnTransed, unTransLocale }
