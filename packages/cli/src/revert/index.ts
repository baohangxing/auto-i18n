import path from 'path'
import fs from 'fs'
import type { FileExtension, I18nCallRules } from '@h1mple/auto-i18n-core'
import {
  checkInPatterns,
  getRecursivePaths, initJsParse,
  initTsxParse, lintFiles, revertJs,
  revertVue, writeFileSyncForce,
} from '@h1mple/auto-i18n-core'
import log from '../utils/log'
import { getAutoConfig } from '../config/config'
import type { RevertCommandOption } from '../types'

const revertCode = (
  code: string,
  ext: FileExtension,
  rules: I18nCallRules,
  locale: string,
): string => {
  switch (ext) {
    case 'cjs':
    case 'mjs':
    case 'js':
    case 'jsx':
      return revertJs(code, {
        rule: rules[ext],
        parse: initJsParse(),
        locale,
      })
    case 'ts':
    case 'tsx':
      return revertJs(code, {
        rule: rules[ext],
        parse: initTsxParse(),
        locale,
      })
    case 'vue':
      return revertVue(code, {
        rule: rules[ext],
        parse: initTsxParse(),
        locale,
      })
    default:
      log.error(`Not support revert .${ext} extension`)
      return ''
  }
}

const revertSingleFile = (filePath: string, locale: string) => {
  const autoConfig = getAutoConfig()
  const ext = path.parse(filePath).ext.slice(1) as FileExtension
  const source = fs.readFileSync(filePath, 'utf8')
  const code = revertCode(source, ext, autoConfig.i18nCallRules, locale)
  return code
}

const revert = async (option: RevertCommandOption) => {
  const autoConfig = getAutoConfig()

  const paths: string[] = getRecursivePaths(option.revertPath)

  const revertRoot = fs.statSync(path.join(process.cwd(), option.revertPath)).isDirectory()
    ? path.join(process.cwd(), option.revertPath)
    : path.join(process.cwd(), option.revertPath, '..')

  const revertRootName = path.parse(revertRoot).name

  let locale = option.target

  if (!locale)
    locale = locale = autoConfig.baseLocale

  if (!autoConfig.locales.includes(locale)) {
    log.error(`No locale file ${locale}.json, use the autoConfig.baseLocale ${autoConfig.baseLocale}`)
    locale = autoConfig.baseLocale
  }

  for (const filePath of paths) {
    const code = revertSingleFile(filePath, locale)

    if (code) {
      const outputPath = path.join(process.cwd(),
        autoConfig.outputFileDir, `revert-${revertRootName}`, filePath.replace(revertRoot, '.'))

      writeFileSyncForce(outputPath, code, 'utf8')
      if (autoConfig.autoFormat && checkInPatterns(outputPath, autoConfig.autoFormatRules))
        await lintFiles(outputPath)
    }
  }
}

export { revert }
