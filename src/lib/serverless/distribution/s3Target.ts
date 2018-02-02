import { IEndpointConstructor } from './endpoint'
import { S3Endpoint } from './s3Endpoint'
import { Target } from './target'

export class S3Target extends Target<S3Endpoint> {
  endpointClass = S3Endpoint
  accessOriginResourceName: string
  get targetId() {
    return `s3-assets`
  }

  constructor(
    targetShortId: string,
    accessOriginResourceName: string,
    paths: IEndpointConstructor[]
  ) {
    super(targetShortId, paths)
    this.targetShortId = targetShortId
    this.accessOriginResourceName = accessOriginResourceName
  }

  config() {
    return {
      DomainName: `${this.targetShortId}.s3.amazonaws.com`,
      Id: this.targetId,
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
