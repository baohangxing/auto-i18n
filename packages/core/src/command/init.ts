import path from 'path'
import { cosmiconfigSync } from 'cosmiconfig'
import fs from 'fs-extra'
import serialize from 'serialize-javascript'
import { CLI_CONFIG_NAME } from '../utils/constants'
import log from '../utils/log'
import defaultAutoConfig from '../utils/defaultAutoConfig'
import { format } from '../utils/help'

const init = async () => {
  const explorer = cosmiconfigSync(CLI_CONFIG_NAME)
  const result = explorer.search()

  if (result?.config) {
    log.info('the project had inited, so skipped')
  }
  else {
    const configPath = path.resolve(process.cwd(), `${CLI_CONFIG_NAME}.config.cjs`)
    const code = `
    module.exports = ${serialize(defaultAutoConfig, {
      unsafe: true,
    })}
  `
    fs.outputFileSync(configPath, code)
    await format(configPath)
    log.success('inited')
  }
}

export { init }
