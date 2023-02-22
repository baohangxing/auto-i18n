import { createI18n } from 'vue-i18n'
import ja from './locales/JA.json'
import zh from './locales/cN.json'
import ko from './locales/ko-kr.json'
export type LocaleOption = 'zh' | 'ja' | 'ko';
const GMLocalStorageKey = 'vue-demo-local-language'
const initHtmlLangAttribute = () => {
  const lang = getUserLanguage()
  if (document.documentElement.getAttribute('lang') !== lang) {
    document.documentElement.setAttribute('lang', lang)
  }
}
const getNavigatorLanguage = (): LocaleOption => {
  const l = window.navigator.language.split('-')[0].toLowerCase()
  if (l === 'zh' || l === 'ja' || l === 'ko') return l
  for (const x of window.navigator.languages) {
    const lang = x.split('-')[0].toLowerCase()
    if (lang === 'zh' || lang === 'ja' || lang === 'ko') return lang
  }
  console.error(window.navigator.language, ' i18n language not find!!! set default language zh-CN')
  return 'zh'
}
const getUserLanguage = (): LocaleOption => {
  const l = localStorage.getItem(GMLocalStorageKey)
  if (l === 'zh' || l === 'ja' || l === 'ko') return l
  return getNavigatorLanguage()
}
const navigatorLanguage = getNavigatorLanguage()
const language: LocaleOption = getUserLanguage()
const i18n = createI18n<false>({
  legacy: false,
  // you must set `false`, to use Composition API
  locale: language,
  fallbackLocale: 'zh',
  messages: {
    zh: zh,
    ja: ja,
    ko: ko
  }
})
const changeLanguage = (locale: LocaleOption) => {
  if (locale === language) {
    return
  }
  if (locale === navigatorLanguage) {
    localStorage.removeItem(GMLocalStorageKey)
  } else {
    localStorage.setItem(GMLocalStorageKey, locale)
  }
  location.reload()
}
export { i18n, language, changeLanguage, initHtmlLangAttribute }
