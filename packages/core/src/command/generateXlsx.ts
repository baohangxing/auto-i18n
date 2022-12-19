import fsExtra from 'fs-extra'
import { getConfig } from '../utils/config'
import { writeXlsxFile } from '../utils/excel'
import { createFileName, getKeys, getValueByKey } from '../utils/help'

const { readJsonSync } = fsExtra

const generateXlsx = async () => {
  const config = await getConfig()

  const baseLangJsonObj = readJsonSync(config.baseLangJson.path)

  const baseJsonKeySet = new Set(getKeys(baseLangJsonObj))

  const firstRows: string[] = [config.keySymbolInXlsx]
  const sheetsDatas: string[][] = []

  firstRows.push(config.baseLangJson.name)

  const langJsonObjMap = {} as any

  for (const lang of config.otherLangJsons) {
    firstRows.push(lang.name)
    langJsonObjMap[lang.name] = readJsonSync(lang.path)
  }

  for (const key of baseJsonKeySet) {
    const newRow: string[] = []
    newRow.push(key)
    newRow.push(getValueByKey(baseLangJsonObj, key))

    for (const lang of config.otherLangJsons)
      newRow.push(getValueByKey(langJsonObjMap[lang.name], key))

    sheetsDatas.push(newRow)
  }

  writeXlsxFile([firstRows], ['gm'], [sheetsDatas], `${createFileName(config.generateXlsxName)}.xlsx`)
}

export { generateXlsx }
