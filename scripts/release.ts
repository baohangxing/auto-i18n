import { execSync } from 'child_process'
import { readJSONSync } from 'fs-extra'

import { packages } from '../meta/packages'
import { changePackageVersion, updataReadme } from './utils'

const { version: oldVersion } = readJSONSync('package.json')

execSync('bumpp --no-push', { stdio: 'inherit' })

const { version } = readJSONSync('package.json')

if (oldVersion === version) {
  console.log('canceled')
  process.exit()
}

for (const { path } of packages) {
  changePackageVersion(path, version)
  updataReadme(path)
}

execSync('pnpm run build', { stdio: 'inherit' })
execSync('git add .', { stdio: 'inherit' })

execSync(`git commit -m "chore: release v${version}"`, { stdio: 'inherit' })
execSync(`git tag -a v${version} -m "v${version}"`, { stdio: 'inherit' })
