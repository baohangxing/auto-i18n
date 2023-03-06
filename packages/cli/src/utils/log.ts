import type { InspectOptions } from 'node:util'
import chalk from 'chalk'
import cliProgress from 'cli-progress'
import type { Log } from '@yostar/auto-i18n-core'
import colors from 'ansi-colors'
import { LOG_PREFIX } from '../config/constants'

class Logger implements Log<InspectOptions> {
  logPrefix = ''

  logOptions: InspectOptions = {
    depth: 3,
    maxArrayLength: 100,
    maxStringLength: 1500,
    showHidden: true,
  }

  public constructor(prefix: string, options?: InspectOptions) {
    this.logPrefix = prefix
    this.logOptions = Object.assign({ ...this.logOptions }, options)
  }

  public info = (msg: string) => console.log(chalk.bgCyan(`${this.logPrefix} INFO`), chalk.cyan(msg))

  public warning = (msg: string) =>
    console.log(chalk.bgYellow(`${this.logPrefix} WARNING`), chalk.yellow(msg))

  public success = (msg: string) => console.log(chalk.bgGreen(`${this.logPrefix} SUCCESS`), chalk.green(msg))

  public error = (errMsg: string, detail?: any) => {
    console.log(
      chalk.bgRed(`${this.logPrefix} ERROR`),
      chalk.red(errMsg),
    )
    if (detail)
      console.dir(detail, this.logOptions)
  }

  /**
   * Log in CLI when AUTO_I18N_VERBOSE is in process.env
   * @param label string
   * @param msg
   */
  public verbose = (label: string, msg?: any) => {
    if (process.env.AUTO_I18N_VERBOSE) {
      console.log(chalk.bgGray(`${this.logPrefix} VERBOSE`),
        chalk.gray(label))
      if (msg)
        console.dir(msg, this.logOptions)
    }
  }

  public newProgressBar = (sum: number, taskName = '') => {
    const bar = new cliProgress.SingleBar({
      format: `${colors.bgBlueBright(this.logPrefix)} ${taskName} |{bar}| {percentage}% `
        + `|| ${colors.blueBright('{value}/{total}')} Tasks || ${colors.blueBright('{msg}')}`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
    }, cliProgress.Presets.shades_classic)

    return {
      start: (msg = '') => { bar.start(sum, 0, { msg }) },
      update: (current: number, msg = '') => {
        if (current > sum)
          current = sum
        bar.update(current, {
          msg,
        })
      },
      stop: () => { bar.stop() },
    }
  }
}

const logger = new Logger(LOG_PREFIX)

export { Logger }

export default logger
