import path from 'path'
import { cosmiconfigSync } from 'cosmiconfig'
import type { CosmiconfigResult } from 'cosmiconfig/dist/types'
import { fgSync } from '../utils/glob'
import type { AutoBaseConfig, LangJson } from '../types'
import { CLI_CONFIG_NAME } from './constants'
import defaultAutoBaseConfig from './defaultAutoBaseConfig'

const readLocalAutoBaseConfig = (configPath?: string): AutoBaseConfig | null => {
  const explorer = cosmiconfigSync(CLI_CONFIG_NAME)
  const result: CosmiconfigResult = configPath ? explorer.load(configPath) : explorer.search()

  return result?.config
}

const getAutoBaseConfig = (defaultConfig = defaultAutoBaseConfig, configPath?: string) => {
  const autoConfig: AutoBaseConfig = Object.assign({},
    defaultConfig, readLocalAutoBaseConfig(configPath))
  return autoConfig
}

const getJsonPath = (): {
  baseLangJson: LangJson | undefined
  otherLangJsons: LangJson[]
} => {
  const autoConfig = getAutoBaseConfig()

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
    if (!baseLangJson.path)
      throw new Error(`No base JSON file in AutoBaseConfig.localesJsonDirs: ${autoConfig.localesJsonDirs}`)
  }

  return {
    baseLangJson,
    otherLangJsons,
  }
}

export { getAutoBaseConfig, getJsonPath }
