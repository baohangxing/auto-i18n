const sleep = async <T>(ms: number, reslut: T): Promise<T> => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(reslut)
    }, ms)
  })
}

export { sleep }
