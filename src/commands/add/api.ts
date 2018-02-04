import { Command, command, option, Options, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'

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
    const pwd = shell.pwd().toString()
    const dest = join(pwd, 'backend', 'api', `${name}.ts`)
    const src = join(
      __dirname,
      '..',
      '..',
      '..',
      'templates',
      'api',
      'handler.ts'
    )
    shell.mkdir('-p', 'backend/api')
    shell.cp(src, dest)
    shell.sed('-i', 'APINAME', name, dest)

    if (options.path) {
      shell.sed(
        '-i',
        "// static path = '/'",
        `static path = '${options.path}'`,
        dest
      )
    }

    if (options.cors) {
      shell.sed('-i', '// static cors = false', 'static cors = true', dest)
    }

    if (options.method) {
      shell.sed(
        '-i',
        `static method = 'GET'`,
        `static method = '${options.method}'`,
        dest
      )
    }

    log(`created api in: ${dest}`)
  }
}

// suppress all logging when in testing mode
function log(msg: string) {
  if (process.env.NODE_ENV !== 'test') {
    // tslint:disable-next-line:no-console
    console.log(msg)
  }
}
