import path from 'path'
import fs from 'fs'
import { describe, expect, it } from 'vitest'
import { updateLocales } from '../../src/command/update'
import { playground } from '../_helps/playground'

describe('#update', async () => {
  it('should update JSON file', async () => {
    let json = ''
    await playground(async ({
      playgroundRoot,
    }) => {
      const jsonPath = path.join(playgroundRoot, 'locales', 'en.json')
      await updateLocales()
      json = fs.readFileSync(jsonPath).toString()
    })
    expect(json).toMatchSnapshot()
  })
})
