import type { AutoBaseConfig, I18nCallRule } from '../types'

const getCommonI18nCallRule = (): I18nCallRule => {
  return {
    transCaller: '',
    transIdentifier: 't',
    variableDeclaration: 'const { t } = useI18n();',
    importDeclaration: 'import { useI18n } from "vue-i18n";',
  }
}

const defaultAutoBaseConfig: AutoBaseConfig = {
  localesJsonDirs: ['**/locales/**.json', '!test/**'],
  locales: [],
  baseLocale: '',

  transInterpolationsMode: 'NamedInterpolationMode',
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

export default defaultAutoBaseConfig
