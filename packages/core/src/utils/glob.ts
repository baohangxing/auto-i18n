import path from 'path'
import fs from 'fs'
import fg from 'fast-glob' // https://github.com/mrmlnc/fast-glob
import type { Options } from 'fast-glob'

const fgOptions: Options = {
  absolute: true,
  ignore: ['**/node_modules/**', '**/*.d.ts'],
  deep: 100,
}

/** get absolute paths with the glob patterns */
const fgSync = (patterns: string[] | string): string[] => {
  const source = ([] as string[]).concat(patterns)
  return fg.sync(source, fgOptions)
}

/** wheather the patterns match the absolute path or not */
const checkInPatterns = (path: string, patterns: string[] | string): boolean => {
  const source = ([] as string[]).concat(patterns)
  const paths = fgSync(source)
  return paths.includes(path)
}

/** get absolute paths by a dir or file path recursively */
const getRecursivePaths = (dirOrFile: string, cwd = process.cwd()): string[] => {
  const dirOrFilePath = path.join(cwd, dirOrFile)

  if (!fs.existsSync(dirOrFilePath))
    return []

  if (fs.statSync(dirOrFilePath).isDirectory()) {
    const files: string[] = []
    const dirs = [dirOrFilePath]

    while (dirs.length) {
      const dir: string = dirs.pop() as string
      if (!fs.existsSync(dir))
        continue
      if (fs.statSync(dir).isDirectory()) {
        if (!dir.match(/node_modules/)) {
          const children = fs.readdirSync(dir)
          dirs.push(...(children.map(x => path.join(dir, x))))
        }
      }
      else if (fs.statSync(dir).isFile()) {
        files.push(dir)
      }
    }
    return files
  }
  else {
    return [dirOrFilePath]
  }
}

export { fgSync, getRecursivePaths, checkInPatterns }
