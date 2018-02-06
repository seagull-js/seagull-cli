import { Command, command, option, Options, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'
import { generateModel } from '../../lib/codegen'
import { log } from '../../lib/logger'

// tslint:disable-next-line:max-classes-per-file
@command({ description: 'scaffold a new data model' })
export default class extends Command {
  execute(
    @param({ description: 'name of the data model', required: true })
    name: string,
    @param({
      description: 'list of data fields, like: `status:string done:boolean`',
      required: false,
    })
    fields?: string
  ) {
    const dataFields = (fields || '')
      .trim()
      .split(' ')
      .map(str => {
        const [fieldName, type] = str.split(':')
        const initialValues = {
          any: '{}',
          boolean: 'false',
          number: '0',
          string: `''`,
        }
        return { name: fieldName, type, initial: initialValues[type] }
      })
    const gen = generateModel(name, { fields: dataFields })
    shell.mkdir('-p', 'models')
    const dest = join(shell.pwd().toString(), 'models', `${name}.ts`)
    gen.toFile(dest)
    log(`created model in: ${dest}`)
  }
}
