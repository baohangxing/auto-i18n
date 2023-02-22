import fsExtra from 'fs-extra'
import { getKeys, getValueByKey } from '@h1mple/auto-i18n-core'
import { getAutoConfig, getJsonPath, getOutputFileDir, isUnTransed } from '../config/config'
import { KEY_SYMBOL_IN_XLSX } from '../config/constants'
import { writeXlsxFile } from '../utils/excel'
import { createFileName } from '../utils/help'

const { readJsonSync } = fsExtra

const generateXlsx = async () => {
  const autoConfig = getAutoConfig()

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

  writeXlsxFile([firstRows], ['all'], [sheetsDatas],
    getOutputFileDir(`${createFileName(autoConfig.outputXlsxNameBy.genXlsx)}.xlsx`),
  )
}

export { generateXlsx }
