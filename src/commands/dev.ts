import { API, Request, Response } from '@seagull-js/seagull'
import { Command, command, metadata, param } from 'clime'
import * as express from 'express'
import { join } from 'path'
import * as shell from 'shelljs'

@command({
  description: 'start local dev server for your app with live reload',
})
export default class extends Command {
  @metadata
  execute() {
    log('> starting dev server with live reload...')
    const nodemon = require('nodemon')
    nodemon({
      exec: 'seagull fmt && seagull serve',
      ext: 'json,ts',
      watch: ['frontend', 'api', 'package.json'],
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
