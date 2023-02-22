import { describe, expect, it } from 'vitest'
import {
  getKeys,
  getValueByKey,
  includeChinese, lexicalComparator,
  setValueByKey,
  sortObjectKey,
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
    expect(() => setValueByKey(obj, 'AA.AZ', newValue)).toThrow()
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
    expect(getKeys(obj)).toEqual(['AA'])
  })

  it('should get all keys', () => {
    const obj = { AA: 'value AA', AC: [] }
    expect(() => getKeys(obj)).toThrowError(/getKeys/)
  })
})
