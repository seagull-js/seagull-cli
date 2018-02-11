import { Command, command, metadata, option, Options, param } from 'clime'
import * as express from 'express'
import { existsSync } from 'fs'
import { join } from 'path'
import * as shell from 'shelljs'
import * as stoppable from 'stoppable'
import App from '../lib/loader/app'
import { log } from '../lib/logger'
import { Server } from '../lib/server/'
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
    await new BuildCommand().execute({ optimize: true })

    const app = new App(process.cwd())
    await app.loadFrontendBundle()
    const server = new Server()
    const port = options && options.port ? options.port : 3000
    server.loadApp(app)
    return server.start(port)
  }
}
