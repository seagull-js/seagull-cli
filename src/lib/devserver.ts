import { API, Request, Response } from '@seagull-js/seagull'
import * as express from 'express'
import App from './loader/app'

export type HttpMethod = 'GET' | 'POST' // TODO: change to string in framework

export default function wrap(app: App): express.Application {
  const server = express()
  addBackendRoutes(app, server)
  return server
}

function addBackendRoutes(app: App, server: express.Application): void {
  for (const api of app.backend) {
    const { path, method } = api.module
    const fn = async (req: express.Request, res: express.Response) => {
      const request = mapRequestFormat(req)
      const handler: API = new (api.module as any)()
      const response = await handler.handle(request)
      res.json(response.body) // TODO: handle redirects'n'stuff
    }
    server[method.toString().toLowerCase()](path, fn)
  }
}

function mapRequestFormat(req: express.Request): Request {
  const method = req.method as HttpMethod
  return new Request(method, req.path, req.params, req.body)
}
