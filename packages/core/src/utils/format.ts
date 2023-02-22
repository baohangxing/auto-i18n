import fs from 'fs'
import path from 'path'
import { ESLint } from 'eslint'

/**
 * check ESlint Config (.eslintrc.* file) exist
 * @param recursive find from process.cwd() to root recursively
 * @returns
 */
const checkEslintConfigExist = (cwd = process.cwd(), recursive = false): [boolean, string] => {
  const maybeNames = ['.eslintrc.js', '.eslintrc.cjs',
    '.eslintrc.yaml', '.eslintrc', '.eslintrc.yml', '.eslintrc.json']

  const checkHelp = (checkPath: string): boolean => {
    for (const name of maybeNames) {
      const eslintrcPath = path.join(checkPath, name)
      if (fs.existsSync(eslintrcPath))
        return true
    }
    return false
  }

  if (recursive) {
    let startPath = cwd
    let nextPath = path.join(startPath, '..')

    if (checkHelp(startPath))
      return [true, startPath]

    while (startPath !== nextPath) {
      if (checkHelp(nextPath))
        return [true, nextPath]
      startPath = nextPath
      nextPath = path.join(startPath, '..')
    }

    return [false, '']
  }
  else {
    return checkHelp(cwd) ? [true, cwd] : [false, '']
  }
}

const initEslint = () => {
  const [useEslintrc, path] = checkEslintConfigExist(process.cwd(), true)
  const eslint = new ESLint({
    cwd: useEslintrc ? path : process.cwd(),
    useEslintrc,
    fix: true,
  })
  return eslint
}

const lintFiles = async (paths: string | string[]) => {
  const eslint = initEslint()

  const filePaths = ([] as string[]).concat(paths)

  for (let i = 0; i < filePaths.length; i++) {
    try {
      const results = await eslint.lintFiles([filePaths[i]])
      const result = results[0]
      if (result && result.output)
        fs.writeFileSync(filePaths[i], result.output, 'utf8')
    }
    catch (error) {
      console.error(error)
    }
  }
}

const lintTextByCreateFile = async (testCode: string, fileExt = 'ts'): Promise<string> => {
  const tmpPath = path.join(process.cwd(), `___eslint_${new Date().getTime()}.${fileExt}`)
  fs.writeFileSync(tmpPath, testCode, 'utf8')
  let result = testCode
  try {
    await lintFiles([tmpPath])
    result = fs.readFileSync(tmpPath, 'utf8')
    fs.rmSync(tmpPath)
  }
  catch (error) {
    fs.rmSync(tmpPath)
    throw error
  }

  return result
}

const lintText = async (testCode: string, fileExt = 'ts'): Promise<string> => {
  const eslint = initEslint()
  const result = await eslint.lintText(testCode)
  if (result?.[0].output === undefined)
    return await lintTextByCreateFile(testCode, fileExt)

  return result?.[0].output
}

export { checkEslintConfigExist, lintFiles, lintText }
