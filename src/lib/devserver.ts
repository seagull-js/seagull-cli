import * as express from 'express'
import { API, Request, Response } from 'seagull'

export default function wrap(app: any): express.Application {
  const server = express()
  addBackendRoutes(app, server)
  return server
}

function addBackendRoutes(app: any, server: express.Application): void {
  for (const route of app.backend) {
    if (route.method === 'GET') {
      addGetRequest(server, route)
    } else {
      addPostRequest(server, route)
    }
  }
}

function addGetRequest(server: express.Application, route: API) {
  server.get(
    route.path,
    async (req: express.Request, res: express.Response) => {
      const request = mapRequestFormat(req)
      const response = await route.handle(request)
      res.json(response.body) // TODO: handle redirects'n'stuff
    }
  )
}

function addPostRequest(server: express.Application, route: API) {
  server.post(
    route.path,
    async (req: express.Request, res: express.Response) => {
      const request = mapRequestFormat(req)
      const response = await route.handle(request)
      res.json(response.body) // TODO: handle redirects'n'stuff
    }
  )
}

function mapRequestFormat(req: express.Request): Request {
  return new Request(req.method, req.path, req.params, req.body)
}
