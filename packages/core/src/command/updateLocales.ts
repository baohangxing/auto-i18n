import path from 'path'
import consola from 'consola'
import fsExtra from 'fs-extra'
import { getKeys, getValueByKey, setValueByKey, sortObjectKey, writeToJsonFile } from '../utils/help'

import { getAutoConfig, getConfig } from '../utils/config'

const { readJsonSync } = fsExtra

const updateLocales = async () => {
  const autoConfig = await getAutoConfig()
  const config = await getConfig()
  const baseLangJsonObj = readJsonSync(config.baseLangJson.path)

  // sort baseLangJson Obj key
  await writeToJsonFile(path.parse(config.baseLangJson.path).dir, config.baseLangJson.name, baseLangJsonObj)

  for (const langJson of config.otherLangJsons) {
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
        || config.isUnTransed(langValue, langJson.name)) {
        const transedWord = await autoConfig.transLacaleWord(
          baseValue,
          config.baseLangJson.name,
          langJson.name,
        )
        setValueByKey(newObj, x, transedWord)
      }
      langJsonKeySet.delete(x)
    }
    if (langJsonKeySet.size > 0) {
      for (const x of langJsonKeySet) {
        consola.info(
          `${x}: ${getValueByKey(langJsonObj, x)} in ${langJson.name
          }.json is deleted, Pleace check it is used in project!`,
        )
      }
    }

    await writeToJsonFile(path.parse(langJson.path).dir, langJson.name, newObj)
  }

  consola.success('updateLocales success')
}

export { updateLocales }
