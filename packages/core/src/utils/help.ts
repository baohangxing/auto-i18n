import path from 'path'
import fs from 'fs'
import { ESLint } from 'eslint'
import consola from 'consola'

const createFileName = (fileName = 'fileName') => {
  const data = new Date()
  const name = `${fileName}(${
    data.getMonth() + 1
  }-${data.getDate()} ${data.getHours()}:${
    data.getMinutes() <= 9 ? `0${data.getMinutes()}` : data.getMinutes()
  }:${
    data.getSeconds() <= 9 ? `0${data.getSeconds()}` : data.getSeconds()
  })}`

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
 * sort Object by lexical, retren a new Object
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
  fs.writeFileSync(jsonPath, JSON.stringify(sortObjectKey(obj), undefined, 4), 'utf8')

  const eslintrcPath = path.join(path.resolve(), '.eslintrc.js')
  if (fs.existsSync(eslintrcPath)) {
    const eslint = new ESLint({
      fix: true,
      useEslintrc: true,
      baseConfig: (await import(eslintrcPath)).default,
    })
    const results = await eslint.lintFiles(jsonPath)

    if (results[0].output)
      fs.writeFileSync(jsonPath, results[0].output, 'utf8')
    else
      consola.error('eslint Error!', results[0])
  }
}

const getValueByKey = (obj: any, key: string) => {
  if (key === '')
    return obj
  const paths = key.split('.').filter(x => x !== '')

  let temp = obj
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
        consola.error(`can not set ${val} to the ${key}`)
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
        consola.error(`the i18n JSON value only support string (${k}: ${obj[k]})`)
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
}
