import { generateAPI } from '@seagull/code-generators'
import { Command, command, option, Options, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'
import { log } from '../../lib/logger'

export class SomeOptions extends Options {
  @option({
    description: 'url path for the api handler',
    flag: 'p',
    name: 'path',
    placeholder: '/my-handler',
    required: false,
  })
  path?: string

  @option({
    default: false,
    description: 'enable CORS the api handler',
    flag: 'c',
    name: 'cors',
    placeholder: 'true | false',
    required: false,
  })
  cors?: boolean

  @option({
    default: 'GET',
    description: 'http method used for the api handler',
    flag: 'm',
    name: 'method',
    placeholder: 'GET | POST',
    required: false,
  })
  method?: string
}

// tslint:disable-next-line:max-classes-per-file
@command({ description: 'scaffold a new api handler' })
export default class extends Command {
  execute(
    @param({ description: 'name of the api handler', required: true })
    name: string,
    options: SomeOptions
  ) {
    const gen = generateAPI(name, options)
    const pwd = shell.pwd().toString()
    const dest = join(pwd, 'backend', 'api', `${name}.ts`)
    gen.toFile(dest)
    log(`created api in: ${dest}`)
  }
}
