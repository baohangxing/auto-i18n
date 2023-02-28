import path from 'path'
import fs from 'fs'
import type { FileExtension } from '@h1mple/auto-i18n-core'
import {
  KeyCollector, checkInPatterns,
  fgSync, getRecursivePaths, lintFiles, sortObjectKey,
} from '@h1mple/auto-i18n-core'
import fsExtra from 'fs-extra'
import type { TransCommandOption } from '../types/config'
import { transform } from '../transform'
import { getAutoConfig, getOutputFileDir } from '../config/config'
import { createFileName } from '../utils/help'
import logger from '../utils/log'
import { updateBaseLocale, updateLocales } from './update'

const trans = async (option: TransCommandOption) => {
  const autoConfig = getAutoConfig()

  const baseLangJsonObj = fsExtra.readJsonSync(autoConfig.baseLocale)

  const collector = new KeyCollector(baseLangJsonObj, logger)

  const transformSingleFile = (filePath: string, replace: boolean) => {
    const autoConfig = getAutoConfig()
    const ext = path.parse(filePath).ext.slice(1) as FileExtension
    const source = fs.readFileSync(filePath, 'utf-8')
    const { code } = transform(source, ext, autoConfig.i18nCallRules, collector, logger, autoConfig, replace)
    return code
  }

  let paths: string[] = []

  if (option.transPath)
    paths = getRecursivePaths(option.transPath)
  else
    paths = fgSync(autoConfig.includes)

  const jsonObj = fsExtra.readJsonSync(path.join(process.cwd(), option.templateFile))
  collector.init(jsonObj)
  for (const filePath of paths) {
    const code = transformSingleFile(filePath, option.modifyMode)
    if (option.modifyMode) {
      fs.writeFileSync(filePath, code, 'utf-8')
      if (autoConfig.autoFormat && checkInPatterns(filePath, autoConfig.autoFormatRules))
        await lintFiles(filePath)
    }
  }
  if (option.modifyMode) {
    await updateBaseLocale(collector.keyZhMap)
    await updateLocales()
  }
  else {
    const jsonPath = getOutputFileDir(`${createFileName(autoConfig.outputXlsxNameBy.trans)}.json`)

    const obj: any = {}
    for (const x of collector.unExistZhSet)
      obj[x] = x

    fs.writeFileSync(jsonPath, JSON.stringify(sortObjectKey(obj), undefined, 2), 'utf-8')
    if (autoConfig.autoFormat && checkInPatterns(jsonPath, autoConfig.autoFormatRules))
      await lintFiles(jsonPath)
  }
}

export { trans }
