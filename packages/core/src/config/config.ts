import path from 'path'
import { cosmiconfigSync } from 'cosmiconfig'
import type { CosmiconfigResult } from 'cosmiconfig/dist/types'
import fsExtra from 'fs-extra'
import { fgSync } from '../utils/glob'
import type { AutoBaseConfig, LangJson } from '../types'
import { getValueByKey } from '..'
import { CLI_CONFIG_NAME } from './constants'
import defaultAutoBaseConfig from './defaultAutoBaseConfig'

const readLocalAutoBaseConfig = (configPath?: string): AutoBaseConfig | null => {
  const explorer = cosmiconfigSync(CLI_CONFIG_NAME)
  const result: CosmiconfigResult = explorer.search(configPath)

  return result?.config
}

const getAutoBaseConfig = (defaultConfig = defaultAutoBaseConfig, configPath?: string) => {
  const autoConfig: AutoBaseConfig = Object.assign({},
    defaultConfig, readLocalAutoBaseConfig(configPath))
  return autoConfig
}

const getJsonPath = (defaultConfig = defaultAutoBaseConfig, configPath?: string): {
  baseLangJson: LangJson | undefined
  otherLangJsons: LangJson[]
} => {
  const autoConfig = getAutoBaseConfig(defaultConfig, configPath)

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
    /* c8 ignore next 4 */
    if (!findFlag) {
      throw new Error(`No JSON file(${x}.json) in AutoBaseConfig.localesJsonDirs:`
        + ` ${autoConfig.localesJsonDirs}`)
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
    /* c8 ignore next 4 */
    if (!baseLangJson.path)
      throw new Error(`No base JSON file in AutoBaseConfig.localesJsonDirs: ${autoConfig.localesJsonDirs}`)
  }

  return {
    baseLangJson,
    otherLangJsons,
  }
}

const revertWordByKey = (locale: string) :((key: string) => string) => {
  const { baseLangJson, otherLangJsons } = getJsonPath()

  if (!baseLangJson) {
    return (key: string) => {
      return key
    }
  }
  let langObj: any = fsExtra.readJsonSync(baseLangJson.path)

  for (const x of otherLangJsons) {
    if (x.name === locale)
      langObj = fsExtra.readJsonSync(x.path)
  }
  return (key: string) => {
    const val = getValueByKey(langObj, key)
    return typeof val === 'string' ? val : key
  }
}

export { getAutoBaseConfig, getJsonPath, revertWordByKey }
