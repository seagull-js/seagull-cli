import { IS3BucketPermission } from '../interfaces'
export function generateS3BucketPermission(
  resourceName: string,
  accessIdentityResourceName: string
): IS3BucketPermission {
  return {
    Properties: {
      Bucket: {
        Ref: resourceName,
      },
      PolicyDocument: {
        Statement: [
          {
            Action: ['s3:GetObject', 's3:GetObjectAcl'],
            Effect: 'Allow',
            Principal: {
              CanonicalUser: {
                'Fn::GetAtt': [accessIdentityResourceName, 'S3CanonicalUserId'],
              },
            },
            Resource: {
              'Fn::Join': ['', ['arn:aws:s3:::', { Ref: resourceName }, '/*']],
            },
          },
        ],
      },
    },
    Type: 'AWS::S3::BucketPolicy',
  }
}
