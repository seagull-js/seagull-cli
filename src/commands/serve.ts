import { Command, command, metadata, option, Options, param } from 'clime'
import * as express from 'express'
import { existsSync } from 'fs'
import { join } from 'path'
import * as shell from 'shelljs'
import * as stoppable from 'stoppable'
import App from '../lib/loader/app'
import { log } from '../lib/logger'
import wrap from '../lib/server/'
import BuildCommand from './build'

export class SomeOptions extends Options {
  @option({
    description: 'port for the dev server',
    flag: 'p',
    name: 'port',
    placeholder: '3000',
    required: false,
  })
  port?: number
}

// tslint:disable-next-line:max-classes-per-file
@command({ description: 'start local devserver for your app' })
export default class extends Command {
  @metadata
  async execute(options?: SomeOptions) {
    if (!existsSync(join('.seagull', 'assets', 'bundle.js'))) {
      await new BuildCommand().execute({ optimize: false })
    }
    const app = new App(process.cwd())
    await app.loadFrontendBundle()
    const server = stoppable(wrap(app), 0)
    const port = options && options.port ? options.port : 3000
    if (process.env.NODE_ENV === 'test') {
      return server.listen(port, () =>
        log(`static server ready on localhost:${port}`)
      )
    } else {
      server.listen(port, () => log(`static server ready on localhost:${port}`))
    }
  }
}
