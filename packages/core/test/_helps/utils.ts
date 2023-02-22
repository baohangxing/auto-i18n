import path from 'path'

/**
 * Resolve `reslut` after `ms` millisecond
 * @param ms millisecond
 * @param reslut
 * @returns
 */
const sleep = async <T>(ms: number, reslut: T): Promise<T> => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(reslut)
    }, ms)
  })
}

const trimRootPath = (paths: string[], rootPath?: string): string[] => {
  const rp: string = rootPath ?? path.resolve('')
  return paths.map(x => x.replace(rp, '')).sort()
}

export { sleep, trimRootPath }
