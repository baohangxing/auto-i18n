import { execSync } from 'child_process'
import path from 'path'
import fsExtra from 'fs-extra'

execSync(
  'conventional-changelog -p angular -i CHANGELOG.md -s -r 100 -n ./.changelog.js'
  , { stdio: 'inherit' },
)

const changelogPath = path.resolve('.', 'CHANGELOG.md')

let content = fsExtra.readFileSync(changelogPath, 'utf-8')

const repalceItems: [string | RegExp, string][] = [
  [
    /https:\/\/gitcn\.yostar\.net\/hangxing\.bao\/auto-i18n\/commits\//g,
    'https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/-/commit/',
  ],
  [
    /https:\/\/gitcn\.yostar\.net\/hangxing\.bao\/auto-i18n\//g,
    'https://gitcn.yostar.net:8888/hangxing.bao/auto-i18n/',
  ],
]

repalceItems.forEach(([text, repalceText]) => {
  content = content.replace(text, repalceText)
})

fsExtra.writeFileSync(changelogPath, content, 'utf-8')
