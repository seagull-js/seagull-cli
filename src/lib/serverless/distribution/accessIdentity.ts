import { IDistributionAccessIdentity } from '../interfaces'
export function generateDistributionAccessIdentity(
  comment = 'Default Access Identity for your seagull app'
): IDistributionAccessIdentity {
  return {
    Properties: {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: comment,
      },
    },
    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
  }
}
