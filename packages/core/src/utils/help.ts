import path from 'path'
import fs from 'fs'
import { getAutoConfig } from '../config/config'
import log from './log'
import { checkInPatterns } from './glob'
import { format } from './format'

const includeChinese = (code: string): boolean => {
  return /[\u4E00-\u9FFF]/g.test(code)
}

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

const lexicalComparator = (a: string, b: string) => {
  a = a.toString()
  b = b.toString()
  const n = Math.max(a.length, b.length)
  for (let i = 0; i < n; i++) {
    if (a[i] === undefined)
      return -1
    if (b[i] === undefined)
      return 1
    if (a[i] !== b[i])
      return a.charCodeAt(i) - b.charCodeAt(i)
  }
  return -1
}

/**
 * Sort an object by lexical recursively, and return a new object.
 * Not support array value.
 * @param obj
 * @returns
 */
const sortObjectKey = (obj: any): any => {
  if (!obj)
    return {}
  const a: any = {}

  const keys = Object.keys(obj).sort(lexicalComparator)

  for (const key of keys) {
    if (typeof obj[key] === 'object')
      a[key] = sortObjectKey(obj[key])
    else
      a[key] = obj[key]
  }
  return a
}

const writeToJsonFile = async (
  writeToPath: string,
  name: string,
  obj: object,
) => {
  const jsonPath = path.join(writeToPath, `${name}.json`)
  const autoConfig = getAutoConfig()
  fs.writeFileSync(jsonPath, `${JSON.stringify(sortObjectKey(obj), undefined, 2)}\n`, 'utf8')

  if (autoConfig.autoFormat && checkInPatterns(jsonPath, autoConfig.autoFormatRules))
    await format(jsonPath)
}

/**
 * Return `undefined` if no key in `obj`
 */
const getValueByKey = (obj: any, key: string) => {
  if (key === '')
    return obj
  const paths = key.split('.').filter(x => x !== '')

  let temp = obj

  if (temp[key] && typeof temp[key] === 'string')
    return temp[key]

  while (paths.length) {
    const path = paths.shift()

    if (path && temp[path] !== undefined)
      temp = temp[path]
    else
      return undefined
  }
  return temp
}

const setValueByKey = (obj: any, key: string, val: string) => {
  const paths = key.split('.').filter(x => x !== '')

  if (paths.length === 0)
    return

  let temp = obj
  while (paths.length > 1) {
    const path = paths.shift()

    if (path) {
      if (temp[path] === undefined)
        temp[path] = {}

      temp = temp[path]
      if (typeof temp !== 'object') {
        log.error(`Cann't set ${val} to the ${key}`)
        return
      }
    }
  }
  temp[paths[0]] = val
}

const getKeys = (obj: any) => {
  const _getKeys = (obj: any, _before = '') => {
    const res: string[] = []

    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === 'string')
        res.push(_before === '' ? k : `${_before}.${k}`)
      else if (typeof obj[k] === 'object' && !(Array.isArray(obj[k])))
        res.push(..._getKeys(obj[k], _before === '' ? k : `${_before}.${k}`))
      else
        log.error(`The i18n JSON value only support string (${k}: ${obj[k]})`)
    }
    return res
  }
  return _getKeys(obj, '')
}

export {
  writeToJsonFile,
  lexicalComparator,
  sortObjectKey,
  getValueByKey,
  setValueByKey,
  getKeys,
  createFileName,
  includeChinese,
}
