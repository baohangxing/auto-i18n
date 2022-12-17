import path from 'path'
import { existsSync, readJsonSync, writeJsonSync } from 'fs-extra'

const changePackageVersion = (projectPath: string, version: string) => {
  const fp = path.join(path.resolve(projectPath), 'package.json')
  if (existsSync(fp)) {
    const json = readJsonSync(fp)
    json.version = version
    writeJsonSync(fp, json, { spaces: 2 })
  }
}

export { changePackageVersion }
