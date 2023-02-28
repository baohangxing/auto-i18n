import { createRequire } from 'module'
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

  logger?: Log<any>
  baseLangJsonObj: any

  constructor(baseLangJsonObj: any, logger?: Log<any>) {
    this.baseLangJsonObj = baseLangJsonObj
    this.logger = logger
  }

  add(chinese: string) {
    if (!this.zhKeyMap[chinese])
      this.unExistZhSet.add(chinese)
    this.logger?.verbose('Extract Chinese: ', `${chinese}: ${this.getKey(chinese)}`)
  }

  getKey(chinese: string): string {
    if (this.zhKeyMap[chinese])
      return this.zhKeyMap[chinese]

    let newKey = getPinyin(chinese)
    let index = 0

    while (this.keyZhMap[newKey])
      newKey = `${getPinyin(chinese)}-${++index}`

    this.keyZhMap[newKey] = chinese
    this.zhKeyMap[chinese] = newKey

    return newKey
  }

  init(jsonObj?: any) {
    if (!this.inited) {
      const baseLangJsonObj = this.baseLangJsonObj

      const keys = new Set(getKeys(baseLangJsonObj))
      for (const k of keys) {
        const v = getValueByKey(baseLangJsonObj, k)

        this.keyZhMap[k] = v
        this.zhKeyMap[v] = k
      }
      if (jsonObj) {
        const keys = new Set(getKeys(jsonObj))
        for (const k of keys) {
          const v = getValueByKey(jsonObj, k)
          if (this.keyZhMap[k] && this.keyZhMap[k] !== v) {
            this.logger?.error(`JSON key ${k} have 2 kinds of val: ${this.keyZhMap[k]} and ${v}`)
          }
          else {
            this.keyZhMap[k] = v
            this.zhKeyMap[v] = k
          }
        }
      }
      this.inited = true
    }
  }
}

export { getPinyin }

export default KeyCollector
