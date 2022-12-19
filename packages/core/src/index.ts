import { Command } from 'commander'
import { version } from '../package.json'
import { generateXlsx } from './command/generateXlsx'
import { trans } from './command/trans'
import { updateLocales } from './command/updateLocales'
import { updateLocalesFromXlsx } from './command/updateLocalesFromXlsx'
import type { TransCommandOption } from './types/command'

const program = new Command()

program
  .name('auto')
  .description('CLI to help you auto trans your vue project to an i18n-project')
  .version(version)

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

program.command('updateLocales')
  .description('update other Locales-Json file by base Locales-Json file')
  .action(() => {
    updateLocales()
  })

program.command('updateLocalesFromXlsx')
  .description('trans xlsx to locales json files, the frirt line of in the first sheet of the xlsx should have all locales-name and the `key`')
  .argument('<XlsxTemplate>', 'Xlsx file path')
  .action((filePath: string) => {
    updateLocalesFromXlsx(filePath)
  })

program.command('generateXlsx')
  .description('generate an Xlsx file by locales json files, the frirt line of in the first sheet of the xlsx will have all locales-name and the `key`')
  .action(() => {
    generateXlsx()
  })

program.parse()

export * from './types'
