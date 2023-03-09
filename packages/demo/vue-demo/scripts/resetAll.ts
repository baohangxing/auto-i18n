// 还原所有修改
import type { PathLike } from 'fs'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { getRecursivePaths, writeFileSyncForce } from '@yostar/auto-i18n-core'

const copyTo = (formPath: PathLike, toPath: string) => {
  if (existsSync(formPath)) {
    const content = readFileSync(formPath, 'utf-8')
    writeFileSyncForce(toPath, content, 'utf-8')
  }
}

const resetAllFiles = () => {
  const allFiles = getRecursivePaths('.', process.cwd())
  allFiles.forEach((files) => {
    if (files.slice(files.length - 5) === '.copy')
      copyTo(files, files.slice(0, files.length - 5))

    if (files.includes('locales') && files.slice(files.length - 5) === '.json')
      writeFileSync(files, '{}\n', 'utf-8')
  })
}

resetAllFiles()
