import { API, Request, Response } from '@seagull-js/seagull'
import { Command, command, metadata, param } from 'clime'
import * as express from 'express'
import { join } from 'path'
import * as shell from 'shelljs'
import { nodemon } from '../lib/scripts'

@command({
  description: 'start local dev server for your app with live reload',
})
export default class extends Command {
  @metadata
  execute() {
    log('> starting dev server with live reload...')
    nodemon()
  }
}

// suppress all logging when in testing mode
function log(msg: string) {
  if (process.env.NODE_ENV !== 'test') {
    // tslint:disable-next-line:no-console
    console.log(msg)
  }
}
