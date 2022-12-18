import type { AutoConfig } from './packages/core/src/types'

const autoConfig: AutoConfig = {
  localesJsonDirs: './test/s/locales/lang/locales',
  locales: ['zh-cn', 'ja-jp', 'ko-kr'],
  baseLocale: 'zh-cn',
  transLacaleWord(word: string, locale: string, toLocale: string) {
    return Promise.resolve(`[${toLocale.toUpperCase()}]${word}`)
  },
  includes: [],
}

export default autoConfig
