import path from 'path'
import fs from 'fs'
import { describe, expect, it } from 'vitest'
import { updateLocales } from '../../src/command/update'
import { playground } from '../_helps/playground'

// TODO
describe.skip('#update', async () => {
  await playground(async ({
    playgroundRoot,
  }) => {
    it('should update JSON file', async () => {
      const jsonPath = path.join(playgroundRoot, 'locales', 'en.json')
      await updateLocales()
      const json = fs.readFileSync(jsonPath, 'utf-8')
      expect(json).toMatchSnapshot()
    })
  })
})
