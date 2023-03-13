import path from 'path'
import fs from 'fs'
import { describe, expect, it } from 'vitest'
import { updateLocales } from '../../src/command/update'
import { playground } from '../_helps/playground'

describe('#update', async () => {
  await playground(async ({
    playgroundRoot,
  }) => {
    const jsonPath = path.join(playgroundRoot, 'locales', 'en.json')
    await updateLocales()
    const json = fs.readFileSync(jsonPath, 'utf-8')
    it('should update JSON file', async () => {
      expect(json).toMatchSnapshot()
    })
  })
})
