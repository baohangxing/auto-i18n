import { execSync } from 'child_process'
import path from 'path'
import fsExtra from 'fs-extra'

execSync(
  'conventional-changelog -p angular -i CHANGELOG.md -s -r 0 -n ./.changelog.js'
  , { stdio: 'inherit' },
)

const changelogPath = path.resolve('.', 'CHANGELOG.md')

let content = fsExtra.readFileSync(changelogPath, 'utf-8')

const repalceItems: [string | RegExp, string][] = [

]

repalceItems.forEach(([text, repalceText]) => {
  content = content.replace(text, repalceText)
})

fsExtra.writeFileSync(changelogPath, content, 'utf-8')
