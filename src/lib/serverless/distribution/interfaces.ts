export interface ICookieForward {
  Forward: 'none' | 'all' | 'whitelist'
  WhitelistedNames?: string[]
}

export interface IErrorResponseConfig {
  path: string
  code?: number
  ttl?: number
}

export interface IWebConfig {
  default?: string
  responses?: {
    [key: number]: IErrorResponseConfig
  }
}

export interface ITargetConstructor {
  id: string
  target: string
}
