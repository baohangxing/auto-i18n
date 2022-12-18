import { Command } from 'commander'
import { version } from '../package.json'
import { trans } from './command/trans'
import { updateLocales } from './command/updateLocales'
import { updateLocalesFromExcel } from './command/updateLocalesFromExcel'
import type { TransCommandOption } from './types/command'

const program = new Command()

program
  .name('auto')
  .description('CLI to help you auto trans your vue project to an i18n-project')
  .version(version)

program.command('trans')
  .description('trans a single file')
  .argument('<string>', 'file path')
  .option('--gen', 'generate a new file')
  .option('-n, --name <string>', 'new file name', '')
  .action((filePath, options) => {
    console.log(filePath, options)
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
  .argument('<string>', 'file path')
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

program.command('updateLocalesFromExcel')
  .description('trans excel to locales json files, the frirt line of in the first sheet of the excel should have all locales-name and the `key`')
  .argument('<string>', 'Excel file path')
  .action((filePath: string) => {
    updateLocalesFromExcel(filePath)
  })

program.parse()

export type { AutoConfig } from './types'
