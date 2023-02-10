import path from 'path'
import fs from 'fs'
import { describe, expect, it } from 'vitest'
import { readXlsxFile } from '../../src/utils/excel'
import { generateXlsx } from '../../src/command/genXlsx'
import { addTestPlayground, getTestPlaygroundRootPath, removeTestPlayground } from '../testUtils/playground'

describe('#genXlsx', async () => {
  it('should gen Xlsx file', async () => {
    addTestPlayground('genXlsx-1')
    await generateXlsx()
    const rootPath = getTestPlaygroundRootPath('genXlsx-1')

    let result
    for (const file of fs.readdirSync(rootPath)) {
      if (file.match(/\.xlsx/) && fs.statSync(path.join(rootPath, file)).isFile())
        result = readXlsxFile(path.join(rootPath, file))
    }
    removeTestPlayground('genXlsx-1')
    expect(result).toMatchSnapshot()
  })
})
