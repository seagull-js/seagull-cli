export interface IEndpointConstructor {
  path: string
  ttl: number
}

export abstract class Endpoint {
  allowedMethods: string[]
  targetHeaders: string[]
  cachedMethods: string[] = ['HEAD', 'GET', 'OPTIONS']
  cookieForward = {
    Forward: 'none',
  }
  origin: string
  path: string
  ttl = 0

  constructor(origin: string, opt?: IEndpointConstructor) {
    this.origin = origin
    if (opt) {
      this.path = opt.path
      this.ttl = opt.ttl
    }
  }

  json() {
    return {
      AllowedMethods: this.allowedMethods,
      CachedMethods: this.cachedMethods,
      Compress: true,
      DefaultTTL: this.ttl,
      ForwardedValues: {
        Cookies: this.cookieForward,
        Headers: this.targetHeaders,
        QueryString: true,
      },
      PathPattern: this.path, // in case of defaultcachebehavior undefined
      TargetOriginId: this.origin,
      ViewerProtocolPolicy: 'redirect-to-https',
    }
  }
}
