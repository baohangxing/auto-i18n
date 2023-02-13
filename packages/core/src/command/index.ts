import { Command, Option } from 'commander'
import { CLI_CONFIG_NAME } from '../config/constants'
import type { RevertCommandOption, TransCommandOption } from '../types/config'
import { checkAllTranslated } from '../check'
import { revert } from '../revert'
import { version } from './../../package.json'
import { generateXlsx } from './genXlsx'
import { init } from './init'
import { trans } from './trans'
import { updateLocales, updateLocalesFromXlsx } from './update'

const program = new Command()

program
  .name(CLI_CONFIG_NAME)
  .description('A CLI to help you transform your project '
    + 'to an internationalization project automatically.')
  .version(version)

program.addOption(new Option('-d, --debug').hideHelp())
program.addOption(new Option('-vb, --verbose').hideHelp())

program.on('option:verbose', () => {
  process.env.AUTO_I18N_VERBOSE = program.opts().verbose
})
program.on('option:debug', () => {
  process.env.AUTO_I18N_DEBUG = program.opts().debug
})

program.command('init')
  .description('Init yo-auto-i18n, generate an new default config file automatically.')
  .action(() => {
    init()
  })

program.command('trans')
  .description('Transform a single file or all files.')
  .argument('[transPath]', 'file or directory path')
  .option('--modify', 'whether to modify on the source file')
  .option('-t, --template <string>', 'template json file which inclues all language key')
  .action((transPath, options) => {
    const transCommandOption: TransCommandOption = {
      transPath: transPath ?? '',
      modifyMode: !!options.modify,
      templateFile: options.template ?? '',
    }
    trans(transCommandOption)
  })

program.command('update')
  .description('Update other locales Json files by base locales Json file')
  .option('-t, --templateXlsx <string>', 'update locales json files by the Xlsx template file,'
    + ' the frirt line of the first sheet should have all locales names and the `key`', '')
  .action(async (options) => {
    await updateLocales()
    options.templateXlsx && (await updateLocalesFromXlsx(options.templateXlsx))
  })

program.command('genlsx')
  .description('Generate an Xlsx file by locales json files,'
    + ' the frirt line of in the first sheet of the xlsx will have all locales-name and the `key`')
  .action(() => {
    generateXlsx()
  })

program.command('check')
  .description('Check weather all word has been transformed or not')
  .action(() => {
    checkAllTranslated()
  })

program.command('revert')
  .description('revert a transformed file or files in a directory')
  .argument('<revertPath>', 'file or directory path')
  .option('-t, --target <string>', 'the target language when revert')
  .action(async (revertPath, options) => {
    const revertCommandOption: RevertCommandOption = {
      revertPath: revertPath ?? '',
      target: options.target ?? '',
    }
    await revert(revertCommandOption)
  })

program.parse()
