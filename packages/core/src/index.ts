import { Command } from 'commander'
import { version } from '../package.json'
import { generateXlsx } from './command/generateXlsx'
import { init } from './command/init'
import { trans } from './command/trans'
import { updateLocales } from './command/updateLocales'
import { updateLocalesFromXlsx } from './command/updateLocalesFromXlsx'
import type { TransCommandOption } from './type/index'

const program = new Command()

program
  .name('auto')
  .description('A CLI to help you auto trans your project to an i18n-project')
  .version(version)

program.command('init')
  .description('init yo-auto-i18n, generate an new default config file')
  .action(() => {
    init()
  })

program.command('trans')
  .description('trans a single file')
  .argument('<filePath>', 'file path')
  .option('--gen', 'generate a new file')
  .option('-n, --name <string>', 'new file name', '')
  .action((filePath, options) => {
    const transCommandOption: TransCommandOption = {
      filePath,
      generateNewFile: !!options.gen,
      newFileName: options.name ?? '',
    }
    trans(transCommandOption)
  })

// TODO
program.command('transAll')
  .description('trans a single file')
  .argument('<filePath>', 'file path')
  .option('--gen', 'generate new files')
  .option('-n, --name <string>', 'new file name', '')
  .action((filePath, options) => {
    const transCommandOption: TransCommandOption = {
      filePath,
      generateNewFile: !!options.gen,
      newFileName: options.name ?? '',
    }
    trans(transCommandOption)
  })

program.command('updateLocales')
  .description('update other Locales-Json files by base Locales-Json file')
  .option('-t, --templateXlsx <string>', 'update locales json files by the Xlsx template file, the frirt line of the first sheet should have all locales-name and the `key`', '')
  .action(async (options) => {
    await updateLocales()
    options.templateXlsx && (await updateLocalesFromXlsx(options.templateXlsx))
  })

program.command('generateXlsx')
  .description('generate an Xlsx file by locales json files, the frirt line of in the first sheet of the xlsx will have all locales-name and the `key`')
  .action(() => {
    generateXlsx()
  })

program.parse()

export * from './type'
