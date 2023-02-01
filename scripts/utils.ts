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
    = '> 请阅读[gitlab上的文档](https://gitcn.yostar.net:8888/hangxing.bao/yo-auto-i18n#%E4%BB%8B%E7%BB%8D)'
    + `以获取更好的阅读体验\n\r\n\r${readFileSync(path.resolve('./README.md')).toString()}`

  writeFileSync(path.resolve(readmePath, './README.md'), readme)
}

export { changePackageVersion, updataReadme }
