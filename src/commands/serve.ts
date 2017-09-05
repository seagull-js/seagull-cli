import { API, Request, Response } from '@seagull-js/seagull'
import { Command, command, metadata, param } from 'clime'
import * as express from 'express'
import { join } from 'path'
import * as shell from 'shelljs'
import App from '../lib/loader/app'
import wrap from '../lib/server/'

@command({ description: 'start local devserver for your app' })
export default class extends Command {
  @metadata
  execute() {
    const app = new App(process.cwd())
    const server = wrap(app)
    if (process.env.NODE_ENV === 'test') {
      return server.listen(3000, () => log('server ready on localhost:3000'))
    } else {
      server.listen(3000, () => log('server ready on localhost:3000'))
    }
  }
}

// suppress all logging when in testing mode
function log(msg: string) {
  if (process.env.NODE_ENV !== 'test') {
    // tslint:disable-next-line:no-console
    console.log(msg)
  }
}
