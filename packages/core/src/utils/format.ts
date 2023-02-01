import fs from 'fs'
import { ESLint } from 'eslint'
import log from './log'

const format = async (paths: string | string[]) => {
  log.verbose(`format ${paths} start`)
  const eslint = new ESLint({
    fix: true,
  })

  const filePaths = ([] as string[]).concat(paths)

  const results = await eslint.lintFiles(filePaths)

  for (let i = 0; i < filePaths.length; i++) {
    const result = results[i]
    if (result && result.output)
      fs.writeFileSync(filePaths[i], result.output, 'utf8')
    else
      log.error(`eslint format ${paths} Error!`, results[0])
  }
}

export { format }
