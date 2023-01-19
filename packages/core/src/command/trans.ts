import path from 'path'
import fs from 'fs'
import type { FileExtension, TransCommandOption } from '../types/config'
import log from '../utils/log'
import { transform } from '../transform'
import { getAutoConfig } from '../config/config'
import Collector from '../transform/collector'

const transformSingle = (filePath: string) => {
  const autoConfig = getAutoConfig()
  const ext = path.parse(filePath).ext.slice(1) as FileExtension
  const source = fs.readFileSync(filePath, 'utf8')
  const { code } = transform(source, ext, autoConfig.i18nCallRules)
  return code
}

const trans = (option: TransCommandOption) => {
  console.log(option)
  Collector.init(option.templateFileName)
  if (option.transPath) {
    const filePath = path.resolve(process.cwd(), option.transPath)
    const code = transformSingle(filePath)
    log.info(code)
  }
  else {
    // TODO
    log.info('TODO')
  }
  Collector.updataJson()
}

export { trans }
