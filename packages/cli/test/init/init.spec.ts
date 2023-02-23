import path from 'path'
import fs from 'fs'
import { afterAll, describe, expect, it } from 'vitest'
import { CONFIG_FILE_NAME } from '@h1mple/auto-i18n-core'
import { init } from '../../src/command/init'

describe('#init', async () => {
  const filePath = path.join(CONFIG_FILE_NAME)
  it('should init with formating', async () => {
    await init()
    expect(fs.existsSync(filePath)).toBe(true)
    expect(fs.readFileSync(filePath, 'utf-8')).toMatchSnapshot()
  })

  it('should skip init', async () => {
    await init()
    expect(fs.readFileSync(filePath, 'utf-8')).toMatchSnapshot()
  })

  afterAll(async () => {
    fs.rmSync(filePath)
  })
})
