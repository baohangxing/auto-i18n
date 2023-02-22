import path from 'path'
import fs from 'fs'
import { describe, expect, it, vi } from 'vitest'
import {
  createFileName,
  writeToJsonFile,
} from '../../src/utils/help'

describe('#createFileName', () => {
  it('should return a string', () => {
    expect(createFileName()).toBeTypeOf('string')
  })
  it('should return a fileName by time', async () => {
    const date = new Date(2022, 11, 19)
    const name = 'name'
    vi.useFakeTimers()
    vi.setSystemTime(date)
    expect(createFileName(name)).toBe(`${name}_12_19 0_00_00`)
    vi.useRealTimers()
  })

  it('should return a fileName by time', async () => {
    const date = new Date(2022, 11, 19, 20, 2, 5)
    const name = 'name'
    vi.useFakeTimers()
    vi.setSystemTime(date)
    expect(createFileName(name)).toBe(`${name}_12_19 20_02_05`)
    vi.useRealTimers()
  })

  it('should return different name in different time', async () => {
    const date1 = new Date(2022, 11, 19, 1, 1, 1)
    const date2 = new Date(2022, 11, 19, 1, 1, 2)
    vi.useFakeTimers()
    vi.setSystemTime(date1)
    const name1 = createFileName()
    vi.setSystemTime(date2)
    const name2 = createFileName()
    expect(name1).not.toBe(name2)
    vi.useRealTimers()
  })
})

describe('#writeToJsonFile', () => {
  const filePath = path.join(process.cwd(), 'test', 'utils')
  const name = 'writeToJsonFile.test'
  const jsonPath = path.join(filePath, `${name}.json`)
  const obj = { AA: 'value AA', AC: 'value AB', AB: { AC: 'value AB1', ABA: 12, AA: 'value AA1' } }

  it('should write JSON file', async () => {
    await writeToJsonFile(filePath, name, obj)
    expect(fs.existsSync(jsonPath)).toBe(true)
    expect(fs.readFileSync(jsonPath).toString()).toMatchSnapshot()
    fs.rmSync(jsonPath)
  })
})
