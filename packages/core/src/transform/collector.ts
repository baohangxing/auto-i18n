import path from 'path'
import { createRequire } from 'module'
import fsExtra from 'fs-extra'
import { updateBaseLocale, updateLocales } from '../command/update'
import { getJsonPath } from '../config/config'
import { getKeys, getValueByKey } from '../utils/help'
import log from '../utils/log'

const require = createRequire(import.meta.url)
const { pinyin } = require('pinyin-pro')

const getPinyin = (chinese: string): string => {
  return pinyin(chinese, {
    toneType: 'none',
  }).replace(/\s/g, '')
}

class Collector {
  static keyZhMap: Record<string, string> = {}
  static zhKeyMap: Record<string, string> = {}

  static unExistZhSet = new Set<string>()

  static inited = false

  private constructor() {}

  static add(chinese: string) {
    if (!Collector.zhKeyMap[chinese])
      Collector.unExistZhSet.add(chinese)
    log.verbose('Extract Chinese: ', `${chinese}: ${Collector.getKey(chinese)}`)
  }

  static getKey(chinese: string): string {
    if (Collector.zhKeyMap[chinese])
      return Collector.zhKeyMap[chinese]

    let newKey = getPinyin(chinese)
    let index = 0

    while (Collector.keyZhMap[newKey])
      newKey = `${getPinyin(chinese)}-{${++index}}`

    Collector.keyZhMap[newKey] = chinese
    Collector.zhKeyMap[chinese] = newKey

    return newKey
  }

  static init(keyJsonPath?: string) {
    if (!Collector.inited) {
      const { baseLangJson } = getJsonPath()
      const baseLangJsonObj = fsExtra.readJsonSync(baseLangJson.path)

      const keys = new Set(getKeys(baseLangJsonObj))
      for (const k of keys) {
        const v = getValueByKey(baseLangJsonObj, k)

        Collector.keyZhMap[k] = v
        Collector.zhKeyMap[v] = k
      }
      if (keyJsonPath) {
        const jsonObj = fsExtra.readJsonSync(path.join(process.cwd(), keyJsonPath))
        const keys = new Set(getKeys(jsonObj))
        for (const k of keys) {
          const v = getValueByKey(jsonObj, k)
          if (Collector.keyZhMap[k] && Collector.keyZhMap[k] !== v) {
            log.error(`json key ${k} have 2 kinds of val: ${Collector.keyZhMap[k]} and ${v}`)
          }
          else {
            Collector.keyZhMap[k] = v
            Collector.zhKeyMap[v] = k
          }
        }
      }
    }
    else {
      log.error('Collector has inited')
    }
  }

  static async updataJson() {
    await updateBaseLocale(Collector.keyZhMap)
    await updateLocales()
  }
}

export default Collector
