import { API, Request, Response } from '@seagull/core'
import { APIGatewayEvent, Context } from 'aws-lambda'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import { RequestHandler } from 'express'
import { Handler } from 'express-serve-static-core'
import { defaultTo } from 'lodash'
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
    // favicons
    const faviconsFolder = join(process.cwd(), '.seagull', 'assets', 'favicons')
    wrapFaviconRoutes(this.server, '/favicon', faviconsFolder)
    wrapFaviconRoutes(this.server, '/mstile', faviconsFolder)
    wrapFaviconRoutes(this.server, '/apple-touch-icon', faviconsFolder)
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
      this.server = this.server.listen(port, () =>
        log(`static server ready on localhost:${port}`)
      )
      return this.server
    } else {
      this.server = this.server.listen(port, () =>
        log(`static server ready on localhost:${port}`)
      )
    }
  }

  stop() {
    this.server.close()
  }

  loadApp(app: App) {
    this.router = express.Router()
    for (const api of app.backend) {
      const fn = async (req: express.Request, res: express.Response) => {
        const request = mapRequestFormat(req)
        const handler: API = new (api.module as any)()
        // Todo: 'correct' mappoing of express request to api gateway event
        const response: Response = await api.module.dispatchPromise(
          {
            httpMethod: request.method,
            path: request.path,
            queryStringParameters: request.params,
          } as APIGatewayEvent,
          {} as Context
        )
        res.status(response.statusCode)
        res.setHeader('Content-Type', response.headers['Content-Type'])
        res.setHeader(
          'Cache-Control',
          defaultTo(response.headers['Cache-Control'], 'no-cache, no-store')
        )
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

function wrapFaviconRoutes(server, path: string, faviconsFolder: string) {
  server.use(path + '*', (req, resp, next) => {
    req.url = req.originalUrl
    express.static(faviconsFolder, { maxAge: '0' })(req, resp, next)
  })
}
