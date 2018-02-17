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
  optimizeLayoutFile,
} from '../lib/build/transforms'
import { log } from '../lib/logger'

import { Bundler } from '../lib/build/bundler'
import { Compiler } from '../lib/build/compiler'
import App from '../lib/loader/app'
import { Server } from '../lib/server/index'

export class DevOptions extends Options {
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
  server: Server
  compiler: Compiler

  @metadata
  async execute(options?: DevOptions) {
    process.env.NODE_ENV = 'dev'
    const port = options && options.port ? options.port : 3000
    log(`> starting dev server with live reload on port ${port}...`)
    this.compiler = new Compiler()
    this.server = new Server()
    this.server.start(port)
    lint()
    prettier()
    const bundler = new Bundler(false)
    cleanBuildDirectory()
    initFolder()
    copyAssets()
    Compiler.compile()
    let app = new App(process.cwd())
    this.server.loadApp(app)
    for await (const compiled of this.compiler.watch()) {
      modifyScriptExports()
      addImportIndexFile()
      optimizeLayoutFile()
      await bundler.bundle()
      // refresh serving app
      app = new App(process.cwd())
      await app.loadFrontendBundle()
      this.server.loadApp(app)
    }
  }

  stop() {
    this.compiler.stop()
    this.server.stop()
  }
}
