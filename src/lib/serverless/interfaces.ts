export interface IFunctionEvent {
  [source: string]: {
    path: string
    method: string
  }
}

export interface IFunction {
  handler: string
  timeout: number
  events: IFunctionEvent[]
}

export interface ITable {
  Type: string
  Properties: {
    TableName: string
    AttributeDefinitions: Array<{
      AttributeName: string
      AttributeType: string
    }>
    KeySchema: Array<{
      AttributeName: string
      KeyType: string
    }>
    ProvisionedThroughput: {
      ReadCapacityUnits: number
      WriteCapacityUnits: number
    }
  }
}

export interface IIAMRoleStatement {
  Effect: string
  Action: string[]
  Resource: string
}

export interface IProvider {
  name: string
  runtime: string
  timeout: number
  region: string
  stage: string
  iamRoleStatements: IIAMRoleStatement[]
}

export interface IServerless {
  service: string
  frameworkVersion: string
  plugins: string[]
  provider: IProvider
  functions: { [name: string]: IFunction }
  package?: {
    include: string[]
    exclude: string[]
  }
  resources: {
    Resources: {
      [name: string]:
        | ITable
        | IDistribution
        | IDistributionAccessIdentity
        | IS3Bucket
        | IS3BucketPermission
    }
  }
}

export interface IDistribution {
  Properties: {
    DistributionConfig: {
      Aliases: any
      CacheBehaviors: Array<{
        AllowedMethods: string[]
        CachedMethods: string[]
        Compress: boolean
        DefaultTTL: number
        ForwardedValues: {
          Cookies: {
            Forward: string
          }
          Headers: string[]
          QueryString: boolean
        }
        MaxTTL: number
        MinTTL: number
        PathPattern: string
        TargetOriginId: string
        ViewerProtocolPolicy: string
      }>
      Comment: string
      CustomErrorResponses: Array<{}>
      DefaultCacheBehavior: {
        AllowedMethods: string[]
        CachedMethods: string[]
        Compress: boolean
        DefaultTTL: number
        ForwardedValues: {
          Cookies: {
            Forward: string
          }
          Headers: string[]
          QueryString: boolean
        }
        MaxTTL: number
        MinTTL: number
        PathPattern: string
        TargetOriginId: string
        ViewerProtocolPolicy: string
      }
      DefaultRootObject: any
      Enabled: boolean
      HttpVersion: string
      Origins: Array<{}>
      ViewerCertificate: {}
    }
  }
  Type: string
}

export interface IS3Bucket {
  Type: 'AWS::S3::Bucket'
  Properties: {
    BucketName: string
    AccessControl: 'Private'
  }
}

export interface IS3BucketPermission {
  Type: 'AWS::S3::BucketPolicy'
  Properties: {
    Bucket: string | { Ref: string }
    PolicyDocument: {
      Statement: Array<{
        Action: Array<'s3:GetObject' | 's3:GetObjectAcl'>
        Effect: 'Allow'
        Resource: string | { 'Fn::Join': any[] }
        Principal: {
          CanonicalUser: string | { 'Fn::GetAtt': [string, string] }
        }
      }>
    }
  }
}

export interface IDistributionAccessIdentity {
  Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity'
  Properties: {
    CloudFrontOriginAccessIdentityConfig: {
      Comment: string
    }
  }
}
