import path from 'path'
import fs from 'fs'
import { describe, expect, it } from 'vitest'
import { updateLocales } from '../../src/command/update'
import { addTestPlayground, getTestPlaygroundRootPath, removeTestPlayground } from '../testUtils/playground'

describe('#update', async () => {
  it('should update json file', async () => {
    addTestPlayground('update-1')
    const jsonPath = path.join(getTestPlaygroundRootPath('update-1'), 'locales', 'en.json')
    await updateLocales()
    const json = fs.readFileSync(jsonPath).toString()
    removeTestPlayground('update-1')
    expect(json).toMatchSnapshot()
  })
})
