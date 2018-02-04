import { Command, command, option, Options, param } from 'clime'
import { join } from 'path'
import * as shell from 'shelljs'
import { Class } from '../../lib/codegen'

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
    const gen = new Class(name, 'API')
    gen.addNamedImports('@seagull-js/seagull', ['API', 'Request', 'Response'])

    if (options.path) {
      const docPath = `The URL path where this API will be located. Skip for private functions like cronjobs. Example: '/greetings/{name}'`
      gen.addProp({
        doc: docPath,
        name: 'path',
        static: true,
        type: 'string',
        value: `'${options.path}'`,
      })
    }

    if (options.method || options.path) {
      const docMethod = `This is the HTTP method / verb for the API. Defaults to 'GET'`
      gen.addProp({
        doc: docMethod,
        name: 'method',
        static: true,
        type: 'string',
        value: `'${options.method || 'GET'}'`,
      })
    }

    if (options.cors) {
      const docCors = `The URL path where this API will be located. Skip for private functions like cronjobs. Example: '/greetings/{name}'`
      gen.addProp({
        doc: docCors,
        name: 'cors',
        static: true,
        type: 'boolean',
        value: `${!!options.cors}`,
      })
    }

    const docHandle = `This handle function executes your code. Return one of the following method invocations: 'text', 'json', 'redirect', 'missing', 'error'`
    gen.addMethod({
      async: true,
      body: `return this.text('hello world')`,
      doc: docHandle,
      name: 'handle',
      parameter: [{ name: 'request', type: 'Request' }],
      returnType: 'Promise<Response>',
    })

    const pwd = shell.pwd().toString()
    const dest = join(pwd, 'backend', 'api', `${name}.ts`)
    gen.toFile(dest)
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
