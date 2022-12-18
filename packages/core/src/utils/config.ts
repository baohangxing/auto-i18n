import fs from 'fs'
import path from 'path'
import consola from 'consola'
import type { AutoConfig, Config, LangJson } from '../types'

const configNames = ['auto.config.ts', 'auto.config.js']

const defaultAutoConfig: Required<AutoConfig> = {
  localesJsonDirs: './src/lang/locales',
  locales: ['zh-cn', 'ja-jp', 'ko-kr'],
  baseLocale: 'zh-cn',
  transLacaleWord(word: string, locale: string, toLocale: string) {
    return Promise.resolve(`[${toLocale.toUpperCase()}]${word}`)
  },
  includes: [],
  outputFileDir: './',
}

const readAutoConfig = async (): Promise<AutoConfig> => {
  for (const configName of configNames) {
    const configFilePath = path.join(process.cwd(), configName)
    if (!fs.existsSync(configFilePath)) {
      const res = await import(configFilePath)
      console.log(res)
      return res
    }
  }
  consola.error(`Pleace add ${configNames.join(' or ')} file in your project(${process.cwd()}) and export default AutoConfig`)
  process.exit(1)
}

const getAutoConfig = (() => {
  let autoConfig: Required<AutoConfig>
  (async () => {
    autoConfig = Object.assign({}, defaultAutoConfig, await readAutoConfig())
    return () => {
      return autoConfig
    }
  })()
  return () => autoConfig
})()

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

const config: Config = (() => {
  const autoConfig = getAutoConfig()

  const { baseLangJson, otherLangJsons } = getJsonPath(autoConfig)
  return {
    baseLangJson,
    otherLangJsons,
  }
})()

export { getAutoConfig, config }
