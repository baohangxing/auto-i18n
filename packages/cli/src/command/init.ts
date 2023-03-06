import path from 'path'
import { cosmiconfigSync } from 'cosmiconfig'
import fs from 'fs-extra'
import serialize from 'serialize-javascript'
import { checkEslintConfigExist, fgSync, lintFiles } from '@yostar/auto-i18n-core'
import { CLI_CONFIG_NAME } from '../config/constants'
import log from '../utils/log'
import defaultAutoConfig from '../config/defaultAutoConfig'

const getBaseLocales = (locales: string[]): string => {
  const mayZhNames = ['zh', 'zh-cn', 'cn', 'zg', 'china']
  for (const locale of locales) {
    for (const name of mayZhNames) {
      if (locale.toLowerCase().includes(name.toLowerCase()))
        return locale
    }
  }
  return ''
}

const init = async () => {
  const explorer = cosmiconfigSync(CLI_CONFIG_NAME)
  const result = explorer.search()

  if (result?.config) {
    log.info('The project had inited, so skipped')
  }
  else {
    const configPath = path.join(process.cwd(), `${CLI_CONFIG_NAME}.config.cjs`)

    const config = { ...defaultAutoConfig }

    const paths = fgSync(config.localesJsonDirs)

    config.locales = [...new Set(paths.map(x => path.parse(x).name))].sort()
    config.baseLocale = getBaseLocales(config.locales)

    if (checkEslintConfigExist())
      config.autoFormat = true

    const code
    = `// @ts-check
/** @typedef {import('@yostar/auto-i18n-cli').AutoConfig} AutoConfig **/

/** @type AutoConfig */
module.exports = ${serialize(config, {
      unsafe: true,
    })}`

    fs.outputFileSync(configPath, code)

    if (config.autoFormat)
      await lintFiles(configPath)
    log.success('Inited')
  }
}

export { init }
