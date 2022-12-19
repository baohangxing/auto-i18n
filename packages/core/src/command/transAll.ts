import fs from 'fs'
import path from 'path'
import { generateSFC } from 'vue-sfc-gen'
import { parse } from '@vue/compiler-sfc'
import consola from 'consola'
import type { TransCommandOption } from '../types'

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
      consola.success(`${fileContent} transed:`)
      consola.log(res)
    }
  }
  else { consola.error(`no this file: ${filePath}`) }
}

export { trans }
