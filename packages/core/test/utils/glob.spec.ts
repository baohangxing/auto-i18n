import path from 'path'
import { describe, expect, it } from 'vitest'
import { checkInPatterns, fgSync, getRecursivePaths } from '../../src/utils/glob'
import { trimRootPath } from '../_helps/utils'

describe('#glob', () => {
  describe('fgSync', () => {
    it('should get absolute paths', () => {
      const list = trimRootPath(fgSync(['**/check/**', '!coverage/**']))
      expect(list).toMatchSnapshot()
    })
    it('should get absolute paths', () => {
      const list = trimRootPath(fgSync('src/config/**'))
      expect(list).toMatchSnapshot()
    })
  })

  describe('checkInPatterns', async () => {
    it('should check wheather the patterns match the absolute path or not', () => {
      const patterns = 'src/utils/**'
      const files = fgSync([patterns])
      for (const x of files)
        expect(checkInPatterns(x, patterns)).toBe(true)
    })
  })

  describe('getRecursivePaths', () => {
    it('should get absolute paths by a dir or file path', () => {
      const filePath = path.join('src')
      const list = trimRootPath(getRecursivePaths(filePath))
      expect(list).toMatchSnapshot()
    })

    it('should get absolute paths by a dir or file path', () => {
      const filePath = path.join('test', 'utils', 'glob.spec.ts')
      const list = trimRootPath(getRecursivePaths(filePath))
      expect(list).toEqual(['/test/utils/glob.spec.ts'])
    })

    it('should get absolute paths by a dir or file path', () => {
      const filePath = path.join('test1', 'utils')
      expect(getRecursivePaths(filePath).length).toBe(0)
    })
  })
})
