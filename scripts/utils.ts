import path from 'path'
import { existsSync, readFileSync, readJsonSync, writeFileSync, writeJsonSync } from 'fs-extra'

const changePackageVersion = (projectPath: string, version: string) => {
  const fp = path.join(path.resolve(projectPath), 'package.json')
  if (existsSync(fp)) {
    const json = readJsonSync(fp)
    json.version = version
    writeJsonSync(fp, json, { spaces: 2 })
  }
}

const updataReadme = (readmePath: string) => {
  const readme
    = readFileSync(path.resolve('./README.md')).toString()

  writeFileSync(path.resolve(readmePath, './README.md'), readme, 'utf-8')
}

export { changePackageVersion, updataReadme }
