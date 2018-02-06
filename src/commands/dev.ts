import { Command, command, metadata, option, Options, param } from 'clime'
import * as express from 'express'
import { join } from 'path'
import * as shell from 'shelljs'

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
  execute(options?: SomeOptions) {
    const port = options && options.port ? options.port : 3000
    log(`> starting dev server with live reload on port ${port}...`)
    const nodemon = require('nodemon')
    nodemon({
      exec: `seagull build -o false && NODE_ENV=dev seagull serve -p ${port}`,
      ext: 'json,ts,tsx',
      watch: ['frontend', 'backend', 'package.json'],
    })
    nodemon.on('restart', files => {
      log('App restarted due to: ', files)
    })
  }
}

// suppress all logging when in testing mode
function log(...args) {
  if (process.env.NODE_ENV !== 'test') {
    // tslint:disable-next-line:no-console
    console.log(...args)
  }
}
