import path from 'path'
import fs from 'fs'
import fsExtra from 'fs-extra'
import {
  fgSync, getKeys,
  getValueByKey,
} from '@h1mple/auto-i18n-core'
import type { FileExtension } from '@h1mple/auto-i18n-core'
import log from '../utils/log'
import { getAutoConfig, getJsonPath, getOutputFileDir, isUnTransed } from '../config/config'
import { writeXlsxFile } from '../utils/excel'
import { createFileName } from '../utils/help'
import { getI18nKeys } from './checkHelp'

const checkAllTranslated = () => {
  const autoConfig = getAutoConfig()

  const { baseLangJson, otherLangJsons } = getJsonPath()
  /* c8 ignore next 4 */
  if (!baseLangJson) {
    log.error(`No ${autoConfig.baseLocale} JSON file in ${autoConfig.localesJsonDirs}`)
    return
  }

  let paths: string[] = []

  paths = fgSync(autoConfig.includes)

  const firstRows: string[][] = [
    ['paths', 'untrans key'],
    ['used path', 'keys num', 'keys'],
    ['used key', 'used paths'],
  ]
  const sheetsDatas: string[][][] = [[], [], []]

  const baseLangJsonObj = fsExtra.readJsonSync(baseLangJson.path)

  const allKeysSet = new Set(getKeys(baseLangJsonObj))

  const keysUsedSet = new Set<string>()

  const keysUsedMap = new Map<string, string[]>()

  const langJsonObjMap = {} as any

  firstRows[0].push(baseLangJson.name)

  for (const lang of otherLangJsons) {
    firstRows[0].push(lang.name)
    langJsonObjMap[lang.name] = fsExtra.readJsonSync(lang.path)
  }

  for (const filePath of paths) {
    const autoConfig = getAutoConfig()
    const ext = path.parse(filePath).ext.slice(1) as FileExtension
    const source = fs.readFileSync(filePath, 'utf-8')

    const keys: string[] = []
    try {
      keys.push(...getI18nKeys(source, ext, autoConfig.i18nCallRules, autoConfig.checkUsageMatchAppend))
    }
    catch (e) {
      log.error(`Error when check ${filePath}`, e)
      continue
    }

    for (const x of keys) {
      keysUsedSet.add(x)
      keysUsedMap.set(x, [...(keysUsedMap.get(x) ?? []), filePath])
    }
    sheetsDatas[1].push([filePath, keys.length.toString(), keys.join('\n\r')])
  }

  for (const key of keysUsedSet) {
    if (!allKeysSet.has(key))
      log.error(`JSON do not have key ${key}, pleace check ${baseLangJson.path}`)
    let unTransed = false
    for (const lang of otherLangJsons) {
      const langVal = getValueByKey(langJsonObjMap[lang.name], key)
      if (isUnTransed(langVal, lang.name))
        unTransed = true
    }

    if (unTransed) {
      const item: string[] = [keysUsedMap.get(key)?.join('\n\r') ?? '', key]

      item.push(getValueByKey(baseLangJsonObj, key))

      for (const lang of otherLangJsons) {
        const langVal = getValueByKey(langJsonObjMap[lang.name], key)
        item.push(langVal)
      }

      sheetsDatas[0].push(item)
    }

    sheetsDatas[2].push([key, keysUsedMap.get(key)?.join('\n\r') ?? ''])
  }

  writeXlsxFile(firstRows, ['unTrans key', 'all key detail', 'all key used'], sheetsDatas,
    getOutputFileDir(`${createFileName(autoConfig.outputXlsxNameBy.check)}.xlsx`))

  log.success('Check successed')
}

export { checkAllTranslated }
