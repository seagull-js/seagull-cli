import { API, Request, Response } from '@seagull-js/seagull'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import { join } from 'path'
import * as stoppable from 'stoppable'
import App from '../loader/app'
import { log } from '../logger'

export class Server {
  server
  private router

  constructor() {
    this.server = express()
    // deactivate all browser caching for dev serving
    this.server.use((req, res, next) => {
      res.setHeader('Cache-Control', 'no-cache, no-store')
      next()
    })
    this.server.use(bodyParser.urlencoded({ extended: false }))
    this.server.use(bodyParser.json())
    // assets
    const assetFolder = join(process.cwd(), '.seagull', 'assets')
    this.server.use('/assets', express.static(assetFolder, { maxAge: '0' }))
    // dynamic apis
    this.server.use((req, resp, next) => {
      if (!this.router) {
        return
      }
      this.router(req, resp, next)
    })
    this.server = stoppable(this.server, 0)
  }

  start(port = 3000) {
    if (process.env.NODE_ENV === 'test') {
      return this.server.listen(port, () =>
        log(`static server ready on localhost:${port}`)
      )
    } else {
      this.server.listen(port, () =>
        log(`static server ready on localhost:${port}`)
      )
    }
  }

  loadApp(app: App) {
    this.router = express.Router()
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
      this.router[method](
        (api.module as any).path.replace('/*', '*').toString(),
        fn
      )
    }
  }
}

export type HttpMethod = 'GET' | 'POST' // TODO: change to string in framework

function mapRequestFormat(req: express.Request): Request {
  const method = req.method as HttpMethod
  return new Request(method, req.path, req.query, req.body)
}
