import path from 'path'
import fs from 'fs'
import { afterAll, describe, expect, it } from 'vitest'
import { eslintExist } from '../../src/command/init'

describe('#init', () => {
  describe('eslintExist', () => {
    const filePathForm = path.resolve('..', '..', '.eslintrc.js')
    const filePathTo = path.resolve('.eslintrc.js')
    it('should be false in core', async () => {
      expect(eslintExist()).toBe(false)
    })

    it('should be true when cp from root', async () => {
      fs.cpSync(filePathForm, filePathTo)
      expect(eslintExist()).toBe(true)
    })

    afterAll(() => {
      fs.rmSync(filePathTo)
    })
  })
})
