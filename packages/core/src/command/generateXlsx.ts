import fsExtra from 'fs-extra'
import { getJsonPath, isUnTransed } from '../utils/config'
import { KEY_SYMBOL_IN_XLSX, XLSX_NAME } from '../utils/constants'
import { writeXlsxFile } from '../utils/excel'
import { createFileName, getKeys, getValueByKey } from '../utils/help'

const { readJsonSync } = fsExtra

const generateXlsx = async () => {
  const { baseLangJson, otherLangJsons } = getJsonPath()

  const baseLangJsonObj = readJsonSync(baseLangJson.path)

  const baseJsonKeySet = new Set(getKeys(baseLangJsonObj))

  const firstRows: string[] = [KEY_SYMBOL_IN_XLSX]
  const sheetsDatas: string[][] = []

  firstRows.push(baseLangJson.name)

  const langJsonObjMap = {} as any

  for (const lang of otherLangJsons) {
    firstRows.push(lang.name)
    langJsonObjMap[lang.name] = readJsonSync(lang.path)
  }

  for (const key of baseJsonKeySet) {
    const newRow: string[] = []
    newRow.push(key)
    newRow.push(getValueByKey(baseLangJsonObj, key))

    for (const lang of otherLangJsons) {
      const langVal = getValueByKey(langJsonObjMap[lang.name], key)
      newRow.push(isUnTransed(langVal, lang.name) ? '' : langVal)
    }

    sheetsDatas.push(newRow)
  }

  writeXlsxFile([firstRows], ['gm'], [sheetsDatas], `${createFileName(XLSX_NAME)}.xlsx`)
}

export { generateXlsx }
