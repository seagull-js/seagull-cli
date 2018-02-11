import { IEndpointConstructor } from './endpoint'
import { S3Endpoint } from './s3Endpoint'
import { Target } from './target'

export interface IS3Options {
  accessOriginResourceName: string
  originId?: string
  targetPathPraefix?: string
}

export class S3Target extends Target<S3Endpoint> {
  endpointClass = S3Endpoint
  accessOriginResourceName: string
  originId?: string
  bucketName: string
  targetPathPraefix?: string

  get targetId() {
    if (!this.originId) {
      return 's3-target'
    }
    return this.originId
  }

  constructor(
    bucketName: string,
    paths: IEndpointConstructor[],
    options: IS3Options
  ) {
    super(bucketName, paths)
    this.bucketName = bucketName
    this.accessOriginResourceName = options.accessOriginResourceName
    this.originId = options.originId
    this.targetPathPraefix = options.targetPathPraefix
  }

  config() {
    return {
      DomainName: `${this.bucketName}.s3.amazonaws.com`,
      Id: this.targetId,
      OriginPath: this.targetPathPraefix,
      S3OriginConfig: {
        OriginAccessIdentity: {
          'Fn::Join': [
            '',
            [
              'origin-access-identity/cloudfront/',
              {
                Ref: this.accessOriginResourceName,
              },
            ],
          ],
        },
      },
    }
  }
}
