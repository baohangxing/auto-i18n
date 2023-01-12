import fs from 'fs'
import path from 'path'
import { cosmiconfigSync } from 'cosmiconfig'
import type { AutoConfig, LangJson } from '../type'
import log from './log'
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

  const dirs = typeof autoConfig.localesJsonDirs === 'string'
    ? [autoConfig.localesJsonDirs]
    : autoConfig.localesJsonDirs

  let otherLangJsons: LangJson[] = []

  const files: string[] = []

  for (const dir of dirs) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      const children = fs.readdirSync(dir)
      for (const x of children) {
        const childPath = path.join(dir, x)
        if (fs.statSync(childPath).isFile())
          files.push(childPath)
      }
    }
  }

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
      log.error(`No json file(${autoConfig.baseLocale}.json) in AutoConfig.localesJsonDirs: ${autoConfig.localesJsonDirs}`)
      process.exit(1)
    }
  }

  return {
    baseLangJson,
    otherLangJsons,
  }
}
const isUnTransed = (str: string, locale: string) => {
  const autoConfig = getAutoConfig()
  return str.indexOf(autoConfig.untransSymbol(locale)) === 0
}

const unTransLocale = (str: string, locale: string) => {
  const autoConfig = getAutoConfig()
  return autoConfig.untransSymbol(locale) + str
}

export { getAutoConfig, getJsonPath, isUnTransed, unTransLocale }
