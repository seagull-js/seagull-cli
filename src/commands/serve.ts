import { API, Request, Response } from '@seagull-js/seagull'
import { Command, command, metadata, param } from 'clime'
import * as express from 'express'
import { join } from 'path'
import * as shell from 'shelljs'
import App from '../lib/loader/app'

@command({ description: 'start local devserver for your app' })
export default class extends Command {
  @metadata
  execute() {
    log('> starting dev server with live reload (TODO: reload)...')
    const path = join(shell.pwd().toString(), '.seagull')
    const app = new App(path)
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

function wrap(app: App): express.Application {
  const server = express()
  for (const api of app.backend) {
    const fn = async (req: express.Request, res: express.Response) => {
      const request = mapRequestFormat(req)
      const handler: API = new (api.module as any)()
      const response = await handler.handle(request)
      res.json(response.body) // TODO: handle redirects'n'stuff
    }
    const method = api.module.method.toString().toLowerCase()
    server[method](api.module.path.toString(), fn)
  }
  return server
}

export type HttpMethod = 'GET' | 'POST' // TODO: change to string in framework

function mapRequestFormat(req: express.Request): Request {
  const method = req.method as HttpMethod
  return new Request(method, req.path, req.params, req.body)
}
