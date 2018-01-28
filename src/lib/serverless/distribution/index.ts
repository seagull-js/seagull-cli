import { flatten, get, head, map, merge, omit } from 'lodash'

import { IErrorResponseConfig, IWebConfig } from './interfaces'
import { Target } from './target'

import { GWEndpoint } from './gwEndpoint'
import { S3Endpoint } from './s3Endpoint'

export type Endpoints = GWEndpoint | S3Endpoint

export interface IDistributionConstructor {
  apiService: string
  alias?: {
    cert?: string
    domains?: string[]
  }
  targets: Array<Target<Endpoints>>
  web?: IWebConfig
}

export default class Distribution {
  apiService: string
  alias?: {
    cert?: string
    domains?: string[]
  }
  web: IWebConfig
  targets: Array<Target<Endpoints>>

  constructor(opt: IDistributionConstructor) {
    this.apiService = opt.apiService
    this.alias = opt.alias
    this.targets = opt.targets
    this.web = opt.web
  }

  private get customErrorResponses(): Array<{}> {
    const responses = get(this, 'web.responses', {}) as any
    return map(
      responses,
      (response: IErrorResponseConfig, srcErrCode: number) => {
        return {
          ErrorCachingMinTTL: response.ttl || 0,
          ErrorCode: srcErrCode,
          ResponseCode: response.code,
          ResponsePagePath: response.path,
        }
      }
    )
  }

  private get viewerCertificate(): {} | undefined {
    const certACM = get(this, `alias.cert`, false)
    if (!certACM) {
      return undefined
    }
    return {
      AcmCertificateArn: certACM,
      MinimumProtocolVersion: 'TLSv1.1_2016',
      SslSupportMethod: 'sni-only',
    }
  }

  json() {
    const origins = this.targets.map(target => target.config())
    const endpoints = flatten(this.targets.map(target => target.endpoints()))
    const defaultCacheBehavior = head(this.targets).defaultEndpoint()
    const cacheBehaviors = endpoints.map(endpoint => endpoint.json())
    return {
      Properties: {
        DistributionConfig: {
          Aliases: get(this, `alias.domains`, undefined),
          CacheBehaviors: cacheBehaviors,
          Comment: `${this.apiService}`,
          CustomErrorResponses: this.customErrorResponses,
          DefaultCacheBehavior: defaultCacheBehavior.json(),
          DefaultRootObject: get(this, `web.default`, undefined),
          Enabled: true,
          HttpVersion: 'http2',
          Origins: origins,
          ViewerCertificate: this.viewerCertificate,
        },
      },
      Type: 'AWS::CloudFront::Distribution',
    }
  }
}
