import fs from 'fs'
import { ESLint } from 'eslint'
import log from './log'

const format = async (paths: string | string[]) => {
  log.verbose(`Format ${paths} starting`)
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
      log.error(`Eslint format ${paths} error`, results[i])
  }
}

export { format }
