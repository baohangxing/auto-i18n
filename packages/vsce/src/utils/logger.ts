import type { InspectOptions } from 'node:util'
import type { Log } from '@h1mple/auto-i18n-core'
import * as vscode from 'vscode'
import { PROJECT_NAME } from '../config/constants'

class Logger implements Log<any> {
  logPrefix = ''
  logOptions = {}

  public constructor(prefix: string, options?: InspectOptions) {
    this.logPrefix = prefix
    this.logOptions = Object.assign({ ...this.logOptions }, options)
  }

  public info = (msg: string) => {
    vscode.window.showInformationMessage(msg)
  }

  public warning = (msg: string) => {
    vscode.window.showInformationMessage(msg)
  }

  public success = (msg: string) => {
    vscode.window.showInformationMessage(msg)
  }

  public error = (errMsg: string, detail?: any) => {
    vscode.window.showErrorMessage(errMsg, detail)
  }

  /**
   * Log in CLI when AUTO_I18N_VERBOSE is in process.env
   * @param label string
   * @param msg
   */
  public verbose = (label: string, msg?: any) => {
    if (process.env.AUTO_I18N_VERBOSE) {
      console.log(label)
      if (msg)
        console.dir(msg)
    }
  }

  public newProgressBar = () => {
    return {
      start: () => { },
      update: () => { },
      stop: () => { },
    }
  }
}

const logger = new Logger(PROJECT_NAME)

export { Logger }

export default logger
