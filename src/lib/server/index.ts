import { API, Request, Response } from '@seagull-js/seagull'
import * as express from 'express'
import App from '../loader/app'

export default function wrap(app: App): express.Application {
  const server = express()
  if (app.frontend) {
    server.get('/assets/bundle.js', (req, res) => res.send(app.frontend))
  }
  for (const api of app.backend) {
    const fn = async (req: express.Request, res: express.Response) => {
      const request = mapRequestFormat(req)
      const handler: API = new (api.module as any)()
      const response = await handler.handle(request)
      res.json(response.body) // TODO: handle redirects'n'stuff
    }
    const method = (api.module as any).method.toString().toLowerCase()
    server[method]((api.module as any).path.replace('/*', '*').toString(), fn)
  }
  return server
}

export type HttpMethod = 'GET' | 'POST' // TODO: change to string in framework

function mapRequestFormat(req: express.Request): Request {
  const method = req.method as HttpMethod
  return new Request(method, req.path, req.params, req.body)
}
