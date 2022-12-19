import fs from 'fs'
import path from 'path'
import consola from 'consola'
import type { AutoConfig, Config, LangJson } from '../types'

const configNames = ['auto.config.mjs', 'auto.config.cjs'] // TODO support ts

const defaultAutoConfig: Required<AutoConfig> = {
  localesJsonDirs: './src/lang/locales',
  locales: ['zh-cn', 'ja-jp', 'ko-kr'],
  baseLocale: 'zh-cn',
  untransSymbol: (locale: string) => {
    return `[${locale.toUpperCase()}]`
  },
  transLacaleWord(word: string, locale: string, toLocale: string) {
    return Promise.resolve(`[${toLocale.toUpperCase()}]${word}`)
  },
  includes: [],
  outputFileDir: './',
}

const readAutoConfig = async (): Promise<AutoConfig> => {
  for (const configName of configNames) {
    const configFilePath = path.join(process.cwd(), configName)
    if (fs.existsSync(configFilePath)) {
      const res = await import(configFilePath)
      if (res.default)
        return res.default
    }
  }
  consola.error(`Pleace add ${configNames.join(' or ')} file in your project(${process.cwd()}) and export default AutoConfig`)
  process.exit(1)
}

const getAutoConfig = ((() => {
  let autoConfig: Required<AutoConfig>
  return async () => {
    if (autoConfig)
      return autoConfig
    autoConfig = Object.assign({}, defaultAutoConfig, await readAutoConfig())
    return autoConfig
  }
})())

const getJsonPath = (autoConfig: AutoConfig): {
  baseLangJson: LangJson
  otherLangJsons: LangJson[]
} => {
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
      consola.error(`No json file(${x}.json) in AutoConfig.localesJsonDirs: ${autoConfig.localesJsonDirs}`)
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
      consola.error(`No json file(${autoConfig.baseLocale}.json) in AutoConfig.localesJsonDirs: ${autoConfig.localesJsonDirs}`)
      process.exit(1)
    }
  }

  return {
    baseLangJson,
    otherLangJsons,
  }
}

const getConfig = async (): Promise<Config> => {
  const autoConfig = await getAutoConfig()

  const keySymbolInXlsx = 'key'

  const generateXlsxName = 'generateXlsxName'

  const isUnTransed = (str: string, locale: string) => {
    return str.indexOf(autoConfig.untransSymbol(locale)) === 0
  }

  const { baseLangJson, otherLangJsons } = getJsonPath(autoConfig)
  return {
    keySymbolInXlsx,
    baseLangJson,
    generateXlsxName,
    otherLangJsons,
    isUnTransed,
  }
}

export { getAutoConfig, getConfig }
