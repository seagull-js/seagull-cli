import { IS3Bucket } from '../interfaces'
export function generateS3Bucket(name: string): IS3Bucket {
  return {
    Properties: {
      AccessControl: 'Private',
      BucketName: name,
    },
    Type: 'AWS::S3::Bucket',
  }
}
