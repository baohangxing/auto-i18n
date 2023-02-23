import path from 'path'
import fs from 'fs'
import { checkInPatterns, lintFiles, sortObjectKey } from '@h1mple/auto-i18n-core'
import { getAutoConfig } from '../config/config'

const createFileName = (fileName = ''): string => {
  const data = new Date()
  const name = `${fileName}_${
    data.getMonth() + 1
  }_${data.getDate()} ${data.getHours()}_${
    data.getMinutes() <= 9 ? `0${data.getMinutes()}` : data.getMinutes()
  }_${
    data.getSeconds() <= 9 ? `0${data.getSeconds()}` : data.getSeconds()
  }`

  return name
}

const writeToJsonFile = async (
  writeToPath: string,
  name: string,
  obj: object,
) => {
  const jsonPath = path.join(writeToPath, `${name}.json`)
  const autoConfig = getAutoConfig()
  fs.writeFileSync(jsonPath, `${JSON.stringify(sortObjectKey(obj), undefined, 2)}\n`, 'utf-8')

  if (autoConfig.autoFormat && checkInPatterns(jsonPath, autoConfig.autoFormatRules))
    await lintFiles(jsonPath)
}

export {
  writeToJsonFile,
  createFileName,
}
