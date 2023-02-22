import path from 'path'
import { createRequire } from 'module'
import fsExtra from 'fs-extra'
import { getKeys, getValueByKey } from '../utils/help'
import type { Collector, Log } from '../types'

const require = createRequire(import.meta.url)
const { pinyin } = require('pinyin-pro')

const getPinyin = (chinese: string): string => {
  return pinyin(chinese, {
    toneType: 'none',
  }).replace(/\s/g, '')
}

class KeyCollector implements Collector {
  keyZhMap: Record<string, string> = {}
  zhKeyMap: Record<string, string> = {}

  unExistZhSet = new Set<string>()

  inited = false

  loger?: Log<any>
  baseLangJsonPath: string

  constructor(baseLangJsonPath: string, loger?: Log<any>) {
    this.baseLangJsonPath = baseLangJsonPath
    this.loger = loger
  }

  add(chinese: string) {
    if (!this.zhKeyMap[chinese])
      this.unExistZhSet.add(chinese)
    this.loger?.verbose('Extract Chinese: ', `${chinese}: ${this.getKey(chinese)}`)
  }

  getKey(chinese: string): string {
    if (this.zhKeyMap[chinese])
      return this.zhKeyMap[chinese]

    let newKey = getPinyin(chinese)
    let index = 0

    while (this.keyZhMap[newKey])
      newKey = `${getPinyin(chinese)}-{${++index}}`

    this.keyZhMap[newKey] = chinese
    this.zhKeyMap[chinese] = newKey

    return newKey
  }

  init(keyJsonPath?: string) {
    if (!this.inited) {
      const baseLangJsonPath = this.baseLangJsonPath
      const baseLangJsonObj = fsExtra.readJsonSync(baseLangJsonPath)

      const keys = new Set(getKeys(baseLangJsonObj))
      for (const k of keys) {
        const v = getValueByKey(baseLangJsonObj, k)

        this.keyZhMap[k] = v
        this.zhKeyMap[v] = k
      }
      if (keyJsonPath) {
        const jsonObj = fsExtra.readJsonSync(path.join(process.cwd(), keyJsonPath))
        const keys = new Set(getKeys(jsonObj))
        for (const k of keys) {
          const v = getValueByKey(jsonObj, k)
          if (this.keyZhMap[k] && this.keyZhMap[k] !== v) {
            this.loger?.error(`JSON key ${k} have 2 kinds of val: ${this.keyZhMap[k]} and ${v}`)
          }
          else {
            this.keyZhMap[k] = v
            this.zhKeyMap[v] = k
          }
        }
      }
    }
  }
}

export default KeyCollector
