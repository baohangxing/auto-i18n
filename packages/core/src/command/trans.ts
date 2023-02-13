import path from 'path'
import fs from 'fs'
import type { FileExtension, TransCommandOption } from '../types/config'
import { transform } from '../transform'
import { getAutoConfig, getOutputFileDir } from '../config/config'
import Collector from '../transform/collector'
import { checkInPatterns, fgSync, getPaths } from '../utils/glob'
import { format } from '../utils/format'
import { createFileName, sortObjectKey } from '../utils/help'

const transformSingleFile = (filePath: string, replace: boolean) => {
  const autoConfig = getAutoConfig()
  const ext = path.parse(filePath).ext.slice(1) as FileExtension
  const source = fs.readFileSync(filePath, 'utf8')
  const { code } = transform(source, ext, autoConfig.i18nCallRules, replace)
  return code
}

const trans = async (option: TransCommandOption) => {
  const autoConfig = getAutoConfig()

  let paths: string[] = []

  if (option.transPath)
    paths = getPaths(option.transPath)
  else
    paths = fgSync(autoConfig.includes)

  Collector.init(option.templateFile)
  for (const filePath of paths) {
    const code = transformSingleFile(filePath, option.modifyMode)
    if (option.modifyMode) {
      fs.writeFileSync(filePath, code, 'utf8')
      if (autoConfig.autoFormat && checkInPatterns(filePath, autoConfig.autoFormatRules))
        await format(filePath)
    }
  }
  if (option.modifyMode) {
    Collector.updataJson()
  }
  else {
    const jsonPath = getOutputFileDir(`${createFileName(autoConfig.outputXlsxNameBy.trans)}.json`)

    const obj: any = {}
    for (const x of Collector.unExistZhSet)
      obj[x] = x

    fs.writeFileSync(jsonPath, JSON.stringify(sortObjectKey(obj), undefined, 2), 'utf8')
    if (autoConfig.autoFormat && checkInPatterns(jsonPath, autoConfig.autoFormatRules))
      await format(jsonPath)
  }
}

export { trans }
