import path from 'path'
import fs from 'fs'
import { afterAll, describe, expect, it } from 'vitest'
import { CONFIG_FILE_NAME } from '../../src/config/constants'
import { init } from '../../src/command/init'

describe('#init', async () => {
  const filePath = path.join(CONFIG_FILE_NAME)
  it('should init without formating', async () => {
    await init()
    expect(fs.readFileSync(filePath).toString()).toMatchSnapshot()
  })

  it('should skip init', async () => {
    await init()
    expect(fs.readFileSync(filePath).toString()).toMatchSnapshot()
  })

  afterAll(() => {
    fs.rmSync(filePath)
  })
})
