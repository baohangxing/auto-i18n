import path from 'path'
import fs from 'fs'
import { afterAll, describe, expect, it } from 'vitest'
import { readXlsxFile, writeXlsxFile } from '../../src/utils/excel'

const rows = [['第一列', '第二列'], ['第一列']]
const sheets = ['Sheet1', 'Sheet2']
const sheetsDatas = [
  [['sheet1-第一列-数据-1', 'sheet1-第二列-数据-1'],
    ['sheet1-第一列-数据-2', 'sheet1-第二列-数据-2']],
  [['sheet2-第一列-数据-1'], ['sheet2-第一列-数据-2']]]
const filePath = path.join(process.cwd(), 'test', 'utils', 'writeXlsxFile.test.xlsx')
const unexistFilePath = path.join(process.cwd(), 'test', 'utils', 'unexist', 'writeXlsxFile.test.xlsx')

describe('#writeXlsxFile', () => {
  it('should write xlsx file', () => {
    writeXlsxFile(rows, sheets, sheetsDatas,
      filePath,
    )
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it('should fail write unexist path', () => {
    expect(() => {
      writeXlsxFile(rows, sheets, sheetsDatas,
        unexistFilePath,
      )
    }).toThrowError('no such file or director')

    expect(fs.existsSync(unexistFilePath)).toBe(false)
  })
})

describe('#readXlsxFile', () => {
  it('should read xlsx file', async () => {
    const result = readXlsxFile(filePath)
    expect(result).toMatchSnapshot()
  })
  it('should fail read unexist xlsx file', () => {
    expect(() => readXlsxFile(unexistFilePath)).toThrowError('Don\'t exist')
  })
})

afterAll(async () => {
  fs.rmSync(filePath)
})
