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
  describe('checkInPatterns', async () => {
    it('should check wheather the patterns match the absolute path or not', () => {
      const patterns = 'src/utils/**'
      const files = fgSync([patterns])
      for (const x of files)
        expect(checkInPatterns(x, patterns)).toBe(true)
    })
  })

  describe('getPaths', () => {
    it('should get absolute paths by a dir or file path', () => {
      const filePath = path.join('')
      expect(getPaths(filePath).length).toBeGreaterThan(70)
    })

    it('should get absolute paths by a dir or file path', () => {
      const filePath = path.join('test', 'utils', 'glob.spec.ts')
      expect(getPaths(filePath).length).toBe(1)
    })

    it('should get absolute paths by a dir or file path', () => {
      const filePath = path.join('test1', 'utils')
      expect(getPaths(filePath).length).toBe(0)
    })
  })
})
