import path from 'path'
import fsExtra from 'fs-extra'
import {
  getKeys, getValueByKey, setValueByKey,
  sortObjectKey,
  writeToJsonFile,
} from '../utils/help'
import { getAutoConfig, getJsonPath, isUnTransed, unTransLocale } from '../config/config'
import log from '../utils/log'

import { readXlsxFile } from '../utils/excel'
import { KEY_SYMBOL_IN_XLSX } from '../config/constants'

const { readJsonSync } = fsExtra

const updateBaseLocale = async (replaceObj?: any) => {
  const { baseLangJson } = getJsonPath()
  let baseLangJsonObj

  if (replaceObj) {
    baseLangJsonObj = {}
    const addKeySet = new Set(getKeys(replaceObj))

    for (const k of addKeySet) {
      const v = getValueByKey(replaceObj, k)
      setValueByKey(baseLangJsonObj, k, v)
    }
  }
  else {
    baseLangJsonObj = readJsonSync(baseLangJson.path)
  }
  await writeToJsonFile(path.parse(baseLangJson.path).dir, baseLangJson.name, baseLangJsonObj)
}

const updateLocales = async () => {
  const autoConfig = getAutoConfig()
  const { baseLangJson, otherLangJsons } = getJsonPath()
  const baseLangJsonObj = readJsonSync(baseLangJson.path)

  await updateBaseLocale()

  for (const langJson of otherLangJsons) {
    const langJsonObj = readJsonSync(langJson.path)
    const baseJsonKeySet = new Set(getKeys(baseLangJsonObj))
    const langJsonKeySet = new Set(getKeys(langJsonObj))
    const newObj = sortObjectKey(langJsonObj)
    for (const x of baseJsonKeySet) {
      const baseValue = getValueByKey(baseLangJsonObj, x)
      const langValue = getValueByKey(langJsonObj, x)

      if (langValue === undefined
        || langValue === null
        || langValue === ''
        || isUnTransed(langValue, langJson.name)) {
        let transedWord = ''
        if (autoConfig.transLacaleWord) {
          transedWord = await autoConfig.transLacaleWord(
            baseValue,
            baseLangJson.name,
            langJson.name,
          )
        }
        else {
          transedWord = unTransLocale(baseValue, langJson.name)
        }
        setValueByKey(newObj, x, transedWord)
      }
      langJsonKeySet.delete(x)
    }
    if (langJsonKeySet.size > 0) {
      for (const x of langJsonKeySet) {
        log.info(
          `${x}: ${getValueByKey(langJsonObj, x)} in ${langJson.name
          }.json is deleted, Pleace check it is used in project!`,
        )
      }
    }

    await writeToJsonFile(path.parse(langJson.path).dir, langJson.name, newObj)
  }

  log.success('updateLocales success')
}

const updateLocalesFromXlsx = async (filePath: string) => {
  const res = readXlsxFile(path.join(path.resolve(), filePath))

  const { baseLangJson, otherLangJsons } = getJsonPath()
  if (res) {
    const baseLangJsonObj = readJsonSync(baseLangJson.path)

    for (const langJson of otherLangJsons) {
      const langJsonObj = readJsonSync(langJson.path)
      const typeJsonKeySet = new Set(getKeys(baseLangJsonObj))
      const newJsonObj = sortObjectKey(langJsonObj)

      for (const { data } of res) {
        const keyIndex = data[0].indexOf(KEY_SYMBOL_IN_XLSX)
        const langIndex = data[0].indexOf(langJson.name)

        if (keyIndex !== -1 && langIndex !== -1) {
          for (const aLine of data.slice(1)) {
            if (typeJsonKeySet.has(aLine[keyIndex])) {
              if (aLine[langIndex]) {
                setValueByKey(
                  newJsonObj,
                  aLine[keyIndex],
                  aLine[langIndex].toString(),
                )
              }
            }
          }
        }
      }
      await writeToJsonFile(path.parse(langJson.path).dir, langJson.name, newJsonObj)
      log.success(`Write to Json file success in ${langJson.path}`)
    }
  }
}

export { updateLocalesFromXlsx, updateLocales, updateBaseLocale }
