import type { AutoConfig, I18nCallRule } from '../types'

const getCommonI18nCallRule = (): I18nCallRule => {
  return {
    transCaller: '',
    transIdentifier: 't',
    variableDeclaration: 'const { t } = useI18n();',
    importDeclaration: 'import { useI18n } from "vue-i18n";',
  }
}

const defaultAutoConfig: AutoConfig = {
  localesJsonDirs: ['**/locales/**.json'],
  locales: [],
  baseLocale: '',
  untransSymbol: (locale: string) => {
    return `[${locale.toUpperCase()}]`
  },
  includes: [],
  outputFileDir: './',
  i18nCallRules: {
    js: getCommonI18nCallRule(),
    ts: getCommonI18nCallRule(),
    cjs: getCommonI18nCallRule(),
    mjs: getCommonI18nCallRule(),
    jsx: getCommonI18nCallRule(),
    tsx: getCommonI18nCallRule(),
    vue: getCommonI18nCallRule(),
  },
  autoFormat: false,
  autoFormatRules: [],
  outputXlsxNameBy: {
    trans: 'trans',
    genXlsx: 'genXlsx',
    check: 'check',
  },
}

export default defaultAutoConfig
