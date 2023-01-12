import fs from 'fs'
import path from 'path'
import { parse } from '@vue/compiler-sfc'
import { generateSFC } from '../generate'
import type { TransCommandOption } from '../type'
import log from '../utils/log'

const trans = (option: TransCommandOption) => {
  const filePath = path.resolve(option.filePath)

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(path.resolve(option.filePath)).toString()
    const res = generateSFC(parse(fileContent).descriptor)

    if (option.generateNewFile) {
      const { ext, dir, name } = path.parse(filePath)
      fs.writeFileSync(path.join(dir, `${option.newFileName ? option.newFileName : `${name}_transed`}${ext}`), res)
    }
    else {
      log.success(`${fileContent} transed:`)
      log.info(res)
    }
  }
  else { log.error(`no this file: ${filePath}`) }
}

export { trans }
