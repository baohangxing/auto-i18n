// https://github.com/mrmlnc/fast-glob

import fg from 'fast-glob'
import type { Options } from 'fast-glob'

const fgOptions: Options = { absolute: true }

const defaultPatterns = ['!**/node_modules/**']

/** get absolute paths with the glob patterns */
const fgSync = (patterns: string[] | string): string[] => {
  const source = ([] as string[]).concat(defaultPatterns, patterns)
  return fg.sync(source, fgOptions)
}

/** wheather the patterns match the absolute path or not */
const checkInPatterns = (path: string, patterns: string[]): boolean => {
  const paths = fgSync(patterns)
  return paths.includes(path)
}

export { fgSync, checkInPatterns }
