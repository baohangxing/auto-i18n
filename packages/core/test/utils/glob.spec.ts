import path from 'path'
import { describe, expect, it } from 'vitest'
import { checkInPatterns, fgSync, getPaths } from '../../src/utils/glob'

describe('#glob', () => {
  describe('fgSync', () => {
    it('should get absolute paths', () => {
      expect(fgSync('test/utils/**').length).toBeGreaterThan(4)
    })
    it('should get absolute paths', () => {
      expect(fgSync(['src/config/**']).length).toBeGreaterThan(2)
    })
  })
  describe('checkInPatterns', () => {
    it('should check wheather the patterns match the absolute path or not', () => {
      const patterns = 'test/utils/**'
      const files = fgSync([patterns])
      for (const x of files)
        expect(checkInPatterns(x, patterns)).toBe(true)
    })
  })

  describe('getPaths', () => {
    const filePath = path.join('test', 'utils')
    it('should get absolute paths by a dir or file path', () => {
      expect(getPaths(filePath).length).toBeGreaterThan(4)
    })
  })
})
