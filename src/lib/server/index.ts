import { API, Request, Response } from '@seagull-js/seagull'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import { join } from 'path'
import App from '../loader/app'

export default function wrap(app: App): express.Application {
  const server = express()
  // deactivate all browser caching for dev serving
  server.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store')
    next()
  })
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())
  if (app.frontend) {
    const assetFolder = join(process.cwd(), '.seagull', 'assets')
    server.use('/assets', express.static(assetFolder, { maxAge: '1h' }))
  }
  for (const api of app.backend) {
    const fn = async (req: express.Request, res: express.Response) => {
      const request = mapRequestFormat(req)
      const handler: API = new (api.module as any)()
      const response = await handler.handle(request)
      res.status(response.statusCode)
      res.setHeader('Content-Type', response.headers['Content-Type'])
      res.send(response.body)
    }
    const method = (api.module as any).method.toString().toLowerCase()
    server[method]((api.module as any).path.replace('/*', '*').toString(), fn)
  }
  return server
}

export type HttpMethod = 'GET' | 'POST' // TODO: change to string in framework

function mapRequestFormat(req: express.Request): Request {
  const method = req.method as HttpMethod
  return new Request(method, req.path, req.query, req.body)
}
