import chalk from 'chalk'
import { LOG_PREFIX } from './constants'

const log = {
  info: (msg: string) => console.log(chalk.bgCyan(`${LOG_PREFIX} INFO`), chalk.cyan(msg)),
  warning: (msg: string) => console.log(chalk.bgYellow(`${LOG_PREFIX} WARNING`), chalk.yellow(msg)),
  success: (msg: string) => console.log(chalk.bgGreen(`${LOG_PREFIX} SUCCESS`), chalk.green(msg)),
  error: (err: string, msg: unknown = '') => console.log(
    chalk.bgRed(`${LOG_PREFIX} ERROR`),
    chalk.red(err),
    chalk.red(msg)),
  verbose: (label: string, msg: unknown = '') =>
    process.env.AUTO_I18N_VERBOSE && console.log(chalk.bgGray(`${LOG_PREFIX} VERBOSE`), chalk.gray(label), msg),
  debug: (label: string, msg: unknown = '') =>
    process.env.AUTO_I18N_DEBUG && console.log(chalk.bgMagenta(`${LOG_PREFIX} DEBUG`), chalk.magenta(label), msg),
}

export default log
