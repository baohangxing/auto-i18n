import path from 'path'
import fs from 'fs'
import { afterAll, describe, expect, it } from 'vitest'
import { format } from '../../src/utils/format'

const filePath = path.join('test', 'utils', 'format-spec-test.ts')

describe('#format', () => {
  it('should format file content', async () => {
    const content = `/**
    * sort Object by lexical recursively, retren a new Object.
    * not support array value
    * @param obj
    * @returns
    */
    const  sortObjectKey = (obj: any): any => {
    if (!obj)   return {}
    const a: any = {};const  keys =    Object.keys( obj ).sort(lexicalComparator)
    for (const key of keys) { if (typeof obj[key] === 'object')
        a[key] = sortObjectKey(obj[key])
      else
        a[key] = obj[key]
    }
      return a
    }`

    fs.writeFileSync(filePath, content, 'utf8')
    await format(filePath)
    expect(fs.readFileSync(filePath).toString()).toMatchSnapshot()
    expect(fs.readFileSync(filePath).toString()).not.toEqual(content)
  })
})

afterAll(async () => {
  fs.rmSync(filePath)
})
