import path from 'path'
import fs from 'fs'
import fsExtra from 'fs-extra'
import { checkTranslated } from '../check'
import { getAutoConfig, getJsonPath, getOutputFileDir, isUnTransed } from '../config/config'
import type { FileExtension } from '../types'
import { fgSync } from '../utils/glob'
import { writeXlsxFile } from '../utils/excel'
import { createFileName, getKeys, getValueByKey } from '../utils/help'
import log from '../utils/log'

const checkAllTranslated = () => {
  const autoConfig = getAutoConfig()

  const { baseLangJson, otherLangJsons } = getJsonPath()

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
    const source = fs.readFileSync(filePath, 'utf8')

    const keys: string[] = []
    try {
      keys.push(...checkTranslated(source, ext, autoConfig.i18nCallRules))
    }
    catch (e) {
      log.error(`checkTranslated ${filePath} Error`, e)
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
      log.error(`json do not have key ${key}, pleace check ${baseLangJson.path}`)
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

  log.success('check successed')
}

export { checkAllTranslated }
