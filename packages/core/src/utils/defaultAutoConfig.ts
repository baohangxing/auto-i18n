import type { AutoConfig, I18nCallRule } from '../type'

const getCommonI18nCallRule = (): I18nCallRule => {
  return {
    caller: '',
    functionName: 't',
    definedDeclaration: 'const { t } = useI18n();',
    importDeclaration: 'import { useI18n } from "vue-i18n";',
  }
}

const defaultAutoConfig: AutoConfig = {
  localesJsonDirs: ['./src/lang/locales'],
  locales: ['zh-cn', 'ja-jp', 'ko-kr'],
  baseLocale: 'zh-cn',
  untransSymbol: (locale: string) => {
    return `[${locale.toUpperCase()}]`
  },
  includes: [],
  outputFileDir: './',
  exclude: [],
  i18nCallRules: {
    js: getCommonI18nCallRule(),
    ts: getCommonI18nCallRule(),
    cjs: getCommonI18nCallRule(),
    mjs: getCommonI18nCallRule(),
    jsx: getCommonI18nCallRule(),
    tsx: getCommonI18nCallRule(),
    vue: getCommonI18nCallRule(),
  },
}

export default defaultAutoConfig
