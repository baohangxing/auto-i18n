import path from 'path'
import { defaultAutoBaseConfig, getAutoBaseConfig, getJsonPath } from '@h1mple/auto-i18n-core'
import type { AutoConfig } from '../types/config'
import defaultAutoConfig from './defaultAutoConfig'

const getAutoConfig = (configPath?: string): AutoConfig => {
  const autoConfig: AutoConfig = Object.assign({},
    defaultAutoConfig,
    getAutoBaseConfig(defaultAutoBaseConfig, configPath))
  return autoConfig
}

const isUnTransed = (str: string | null | undefined, locale: string) => {
  if (typeof str !== 'string')
    return false
  const autoConfig = getAutoConfig()

  return str.indexOf(autoConfig.untransSymbol(locale)) === 0
}

const unTransLocale = (str: string, locale: string) => {
  const autoConfig = getAutoConfig()
  return autoConfig.untransSymbol(locale) + str
}

const getOutputFileDir = (fileName: string) => {
  const autoConfig = getAutoConfig()
  return path.join(process.cwd(), autoConfig.outputFileDir, fileName)
}

export { getAutoConfig, getJsonPath, isUnTransed, unTransLocale, getOutputFileDir }
