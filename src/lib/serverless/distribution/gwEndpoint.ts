import { Endpoint } from './endpoint'

export class GWEndpoint extends Endpoint {
  allowedMethods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT']
  targetHeaders = ['x-api-key', 'authorization']
}
