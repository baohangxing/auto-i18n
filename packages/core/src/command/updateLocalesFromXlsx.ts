import path from 'path'
import fsExtra from 'fs-extra'

import {
  getKeys,
  setValueByKey,
  sortObjectKey,
  writeToJsonFile,
} from '../utils/help'
import { readXlsxFile } from '../utils/excel'

import log from '../utils/log'
import { getJsonPath } from '../utils/config'

const { readJsonSync } = fsExtra

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
        const keyIndex = data[0].indexOf('key')
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

export { updateLocalesFromXlsx }
