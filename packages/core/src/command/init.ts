import path from 'path'
import { cosmiconfigSync } from 'cosmiconfig'
import fs from 'fs-extra'
import serialize from 'serialize-javascript'
import { CLI_CONFIG_NAME } from '../config/constants'
import log from '../utils/log'
import defaultAutoConfig from '../config/defaultAutoConfig'
import { fgSync } from '../utils/glob'
import { format } from '../utils/format'

const eslintExist = (): boolean => {
  // TODO maybe in package.json
  const maybeNames = ['.eslintrc.js', '.eslintrc.cjs',
    '.eslintrc.yaml', '.eslintrc', '.eslintrc.yml', '.eslintrc.json']
  for (const name of maybeNames) {
    const eslintrcPath = path.resolve(name)
    if (fs.existsSync(eslintrcPath))
      return true
  }
  return false
}

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
    log.info('the project had inited, so skipped')
  }
  else {
    const configPath = path.resolve(`${CLI_CONFIG_NAME}.config.cjs`)

    const config = { ...defaultAutoConfig }

    const paths = fgSync(config.localesJsonDirs)

    config.locales = [...new Set(paths.map(x => path.parse(x).name))]
    config.baseLocale = getBaseLocales(config.locales)

    if (eslintExist())
      config.autoFormat = true

    const code
    = `module.exports = ${serialize(config, {
      unsafe: true,
    })}`

    fs.outputFileSync(configPath, code)

    if (config.autoFormat)
      await format(configPath)

    log.success('inited')
  }
}

export { init }
