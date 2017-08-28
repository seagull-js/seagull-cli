import * as express from 'express'
import { App, GetRequest, IBackendRoute, PostRequest, Response } from 'seagull'

export default function wrap(app: App): express.Application {
  const server = express()
  addBackendRoutes(app, server)
  return server
}

function addBackendRoutes(app: App, server: express.Application): void {
  for (const route of app.backend) {
    if (route.method === 'GET') {
      addGetRequest(server, route)
    } else {
      addPostRequest(server, route)
    }
  }
}

function addGetRequest(server: express.Application, route: IBackendRoute) {
  server.get(
    route.path,
    async (req: express.Request, res: express.Response) => {
      const request = new GetRequest(req.originalUrl, '')
      const data = await route.handler(request)
      res.json(data)
    }
  )
}

function addPostRequest(server: express.Application, route: IBackendRoute) {
  server.post(
    route.path,
    async (req: express.Request, res: express.Response) => {
      const request = new PostRequest(req.originalUrl, {}) // TODO: parse body
      const data = await route.handler(request)
      res.json(data)
    }
  )
}
