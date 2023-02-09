import path from 'path'
import fs from 'fs'
import { describe, expect, it, vi } from 'vitest'
import {
  createFileName,
  getKeys,
  getValueByKey,
  includeChinese, lexicalComparator,
  setValueByKey,
  sortObjectKey, writeToJsonFile,
} from '../../src/utils/help'

describe('#includeChinese', () => {
  it('should return false with `english`', () => {
    expect(includeChinese('english')).toBe(false)
  })
  it('should return true with `南北朝`', () => {
    expect(includeChinese('南北朝')).toBe(true)
  })
  it('should return false with ``', () => {
    expect(includeChinese('')).toBe(false)
  })
  it('should return false with `12332`', () => {
    expect(includeChinese('12332')).toBe(false)
  })

  it('should return true with `IP 是 IP`', () => {
    expect(includeChinese('IP 是 IP')).toBe(true)
  })
})

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

describe('#lexicalComparator', () => {
  it('should return sorted array', () => {
    const arr = ['a', 'ab', 'ba', 'abb', 'Ab', 'AA']
    const sortedArr = ['AA', 'Ab', 'a', 'ab', 'abb', 'ba']
    expect(arr.sort(lexicalComparator)).toEqual(sortedArr)
    expect(arr.sort(lexicalComparator)).toEqual(arr.sort())
  })

  it('should return sorted array', () => {
    const arr = ['c', 'ab', 'c', 'ab']
    const sortedArr = ['ab', 'ab', 'c', 'c']
    expect(arr.sort(lexicalComparator)).toEqual(sortedArr)
    expect(arr.sort(lexicalComparator)).toEqual(arr.sort())
  })
})

describe('#sortObjectKey', () => {
  it('should return sorted object recursively', () => {
    const obj = { AA: 'value AA', AC: 'value AB', AB: { AC: 'value AB1', ABA: 12, AA: 'value AA1' } }
    const sortedObj = sortObjectKey(obj)
    expect(sortedObj).toEqual(obj)
    expect(Object.keys(sortedObj)).toEqual(['AA', 'AB', 'AC'])
    expect(Object.keys(sortedObj.AB)).toEqual(['AA', 'ABA', 'AC'])
  })
})

describe('#sortObjectKey', () => {
  it('should return sorted object recursively', () => {
    const obj = { AA: 'value AA', AC: 'value AB', AB: { AC: 'value AB1', ABA: 12, AA: 'value AA1' } }
    const sortedObj = sortObjectKey(obj)
    expect(sortedObj).toEqual(obj)
    expect(Object.keys(sortedObj)).toEqual(['AA', 'AB', 'AC'])
    expect(Object.keys(sortedObj.AB)).toEqual(['AA', 'ABA', 'AC'])
  })
})

describe('#writeToJsonFile', () => {
  const filePath = path.join(process.cwd(), 'test', 'utils')
  const name = 'writeToJsonFile.test'
  const jsonPath = path.join(filePath, `${name}.json`)
  const obj = { AA: 'value AA', AC: 'value AB', AB: { AC: 'value AB1', ABA: 12, AA: 'value AA1' } }

  it('should write json file', async () => {
    await writeToJsonFile(filePath, name, obj)
    expect(fs.existsSync(jsonPath)).toBe(true)
    expect(fs.readFileSync(jsonPath).toString()).toMatchSnapshot()
    fs.rmSync(jsonPath)
  })
})

describe('#getValueByKey', () => {
  const obj = { AA: 'value AA', AC: 'value AB', AB: { AC: 'value AB1', ABA: 12, AA: 'value AA1' } }

  it('should get value by key', () => {
    expect(getValueByKey(obj, 'AA')).toBe(obj.AA)
  })

  it('should get value by key', () => {
    expect(getValueByKey(obj, 'AA.AA')).toBeUndefined()
  })

  it('should get value by key', () => {
    expect(getValueByKey(obj, 'AB.AC')).toBe(obj.AB.AC)
  })

  it('should get value by key', () => {
    expect(getValueByKey(obj, '')).toEqual(obj)
  })
})

describe('#setValueByKey', () => {
  const obj = { AA: 'value AA', AC: 'value AB', AB: { AC: 'value AB1', ABA: 12, AA: 'value AA1' } }

  it('should set value by key', () => {
    const newValue = 'new value AA'
    setValueByKey(obj, 'AA', newValue)
    expect(obj.AA).toBe(newValue)
  })

  it('should set value by key', () => {
    const newValue = 'new value ACA'
    setValueByKey(obj, 'AA.AZ', newValue)
    expect((obj.AA as any).AZ).toBeUndefined()
  })

  it('should get value by key', () => {
    const newValue = 'new value AB.AC'
    setValueByKey(obj, 'AB.AC', newValue)
    expect(obj.AB.AC).toBe(newValue)
  })
})

describe('#setValueByKey', () => {
  it('should get all keys', () => {
    const obj = { AA: 'value AA', AC: 'value AB', AB: { AC: 'value AB1', AA: { C: '' } } }
    const keys = getKeys(obj)
    expect(keys).toEqual(['AA', 'AC', 'AB.AC', 'AB.AA.C'])
  })

  it('should get all keys', () => {
    const obj = { AA: 'value AA', AC: new Date() }
    const keys = getKeys(obj)
    expect(keys).toEqual(['AA'])
  })

  it('should get all keys', () => {
    const obj = { AA: 'value AA', AC: [] }
    const keys = getKeys(obj)
    expect(keys).toEqual(['AA'])
  })
})
