import { Endpoint } from './endpoint'

export class S3Endpoint extends Endpoint {
  allowedMethods = ['GET', 'HEAD', 'OPTIONS']
  targetHeaders = ['Origin']
}
