import path from 'path'
import fs from 'fs'
import { describe, expect, it } from 'vitest'
import { checkEslintConfigExist, lintFiles, lintText } from '../../src/utils/format'
import { trimRootPath } from '../_helps/utils'

describe('#checkEslintConfigExist', () => {
  it('should return false', async () => {
    const [reslut, configPath] = checkEslintConfigExist(process.cwd(), false)
    expect(reslut).toEqual(false)
    expect(configPath).toEqual('')
  })

  it('should return true', async () => {
    const root = path.join(process.cwd(), '..', '..')
    const [reslut, configPath] = checkEslintConfigExist(process.cwd(), true)
    expect(reslut).toEqual(true)
    expect(trimRootPath([configPath], root)).toMatchSnapshot()
  })
})

describe('#format', () => {
  it('should format file content', async () => {
    const filePath = path.join(__dirname, '..', '..', '..', '..', 'scripts', 'release.ts')

    await lintFiles(filePath)
    const res = fs.readFileSync(filePath, 'utf-8')

    expect(res).toMatchSnapshot()
  })

  it('should lint text', async () => {
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

    const reslut = await lintText(content)
    expect(reslut).toMatchSnapshot()
    expect(reslut).not.toEqual(content)
  })
})
