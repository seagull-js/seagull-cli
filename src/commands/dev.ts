import { Command, command, metadata, option, Options, param } from 'clime'
import * as express from 'express'
import { join } from 'path'
import * as shell from 'shelljs'
import {
  cleanBuildDirectory,
  copyAssets,
  createServerlessYaml,
  initFolder,
  lint,
  prettier,
} from '../lib/build/helper'
import {
  addImportIndexFile,
  modifyScriptExports,
} from '../lib/build/transforms'
import { log } from '../lib/logger'

import { Bundler } from '../lib/build/bundler'
import { Compiler } from '../lib/build/compiler'
import App from '../lib/loader/app'
import { Server } from '../lib/server/index'

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
@command({
  description: 'start local dev server for your app with live reload',
})
export default class extends Command {
  @metadata
  async execute(options?: SomeOptions) {
    const port = options && options.port ? options.port : 3000
    log(`> starting dev server with live reload on port ${port}...`)
    const server = new Server()
    server.start(port)
    lint()
    prettier()
    const bundler = new Bundler(false)
    cleanBuildDirectory()
    initFolder()
    copyAssets()
    Compiler.compile()
    let app = new App(process.cwd())
    server.loadApp(app)
    for await (const compiled of new Compiler().watch()) {
      modifyScriptExports()
      addImportIndexFile()
      await bundler.bundle()
      // refresh serving app
      app = new App(process.cwd())
      await app.loadFrontendBundle()
      server.loadApp(app)
    }
  }
}
