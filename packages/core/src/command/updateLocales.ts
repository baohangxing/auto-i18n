import path from 'path'
import fsExtra from 'fs-extra'
import { getKeys, getValueByKey, setValueByKey, sortObjectKey, writeToJsonFile } from '../utils/help'

import { getAutoConfig, getJsonPath, isUnTransed, unTransLocale } from '../utils/config'
import log from '../utils/log'

const { readJsonSync } = fsExtra

const updateLocales = async () => {
  const autoConfig = getAutoConfig()
  const { baseLangJson, otherLangJsons } = getJsonPath()
  const baseLangJsonObj = readJsonSync(baseLangJson.path)

  // sort baseLangJson Obj key
  await writeToJsonFile(path.parse(baseLangJson.path).dir, baseLangJson.name, baseLangJsonObj)

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

export { updateLocales }
