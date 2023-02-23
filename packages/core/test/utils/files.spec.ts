import path from 'path'
import fs from 'fs'
import { afterAll, describe, expect, it } from 'vitest'
import { writeFileSyncForce } from '../../src'

const root = path.join(__dirname, 'playgroung_test')
const filePath = path.join(root, 'test', 'test.txt')

describe('#writeFileSyncForce', () => {
  it('should write file forcely', async () => {
    const content = 'test'

    writeFileSyncForce(filePath, content, 'utf-8')

    expect(fs.readFileSync(filePath, 'utf-8')).toEqual(content)
  })

  it('should write file forcely', async () => {
    const content = 'test'

    writeFileSyncForce(filePath, content, 'utf-8')

    expect(fs.readFileSync(filePath, 'utf-8')).toEqual(content)
  })
})

afterAll(async () => {
  fs.rmdirSync(root, { recursive: true })
})
