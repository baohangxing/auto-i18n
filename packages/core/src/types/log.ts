interface ProgressBar {
  start: (msg?: string) => void
  update: (current: number, msg?: string) => void
  stop: () => void
}

interface Log<T> {
  logPrefix: string

  logOptions: T

  info: (msg: string) => void

  warning: (msg: string) => void

  success: (msg: string) => void

  error: (msg: string, detail?: any) => void

  verbose: (msg: string, detail?: any) => void

  /**
   * Create a CLI Progress Bar
   * @param sum tasks sum
   * @param taskName
   * @returns
   */
  newProgressBar: (sum: number, taskName?: string) => ProgressBar
}

export { ProgressBar, Log }
