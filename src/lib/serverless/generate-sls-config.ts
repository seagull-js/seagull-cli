import { PackageJson } from '@seagull/package-config'
import { get } from 'lodash'
import App from '../loader/app'
import Builder from './builder'
import { generateDistributionAccessIdentity } from './distribution/accessIdentity'
import { GWTarget } from './distribution/gwTarget'
import Distribution from './distribution/index'
import { S3Target } from './distribution/s3Target'
import { generateS3Bucket } from './s3/bucket'
import { generateS3BucketPermission } from './s3/permission'

const pkg = new PackageJson()
const region = pkg.config.region

export interface IGenerateYmlOpts {
  accountId: string
}

export default function generate(
  app: App,
  { accountId }: IGenerateYmlOpts
): Builder {
  // create instance with defaults
  const sls = new Builder(app.name, region)

  // add backend routes as serverless functions (lambda + apiG)
  for (const api of app.backend) {
    const { method, path } = api.module as { method: string; path: string }
    let events
    if (path.endsWith('*')) {
      // if you want a wildcard you WANT a url like 'bla/*'
      // -> 'bla*' is forbidden
      const proxyPath = path.replace(/\/+\*$/, '')
      events = [
        { http: { method, path: `${proxyPath}/` } },
        { http: { method, path: `${proxyPath}/{proxy+}` } },
      ]
    } else {
      events = [{ http: { method, path } }]
    }
    const fn = { handler: api.handler, timeout: 30, events }
    sls.addFunction(api.name, fn)
  }

  for (const name of app.shrimps) {
    sls.addSimpleDBDomain(name)
  }

  for (const model of app.models) {
    const table = {
      Properties: {
        AttributeDefinitions: [
          {
            AttributeName: 'id',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'id',
            KeyType: 'HASH',
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: model.reads,
          WriteCapacityUnits: model.writes,
        },
        TableName: `${model.appName}-${model.name}`,
      },
      Type: 'AWS::DynamoDB::Table',
    }
    sls.addTable(model.name, table)
  }

  // add access identity so s3 and cloudfront can communicate
  const distributionAccessIdentityResourceName = 'appDistributionAccessIdentity'
  sls.addDistributionAccessIdentity(
    distributionAccessIdentityResourceName,
    generateDistributionAccessIdentity()
  )

  // add default app / assets bucket
  const appBucketName = `${app.name}-${accountId}-assets-bucket`
  const appBucketResource = 'appBucket'
  sls.addS3Bucket(appBucketResource, generateS3Bucket(appBucketName))

  // add permission for the distribution
  sls.addS3BucketPermission(
    appBucketResource + 'Permission',
    generateS3BucketPermission(
      appBucketResource,
      distributionAccessIdentityResourceName
    )
  )

  // add distribution to serve api and app assets
  const distribution = new Distribution({
    alias: {
      domains: get(app, 'package.seagull.domains'),
    },
    apiService: app.name,
    targets: [
      new S3Target(
        appBucketName,
        [
          { path: 'favicon*', ttl: 60 * 60 },
          { path: 'mstile*', ttl: 60 * 60 },
          { path: 'apple-touch-icon*', ttl: 60 * 60 },
        ],
        {
          accessOriginResourceName: distributionAccessIdentityResourceName,
          originId: 's3-favicon',
          targetPathPraefix: '/assets/favicons',
        }
      ),
      new S3Target(appBucketName, [{ path: 'assets/*', ttl: 60 * 60 }], {
        accessOriginResourceName: distributionAccessIdentityResourceName,
        originId: 's3-assets',
      }),
      // GWTarget uses a reference to the default APIG 'APIRestGateway' in the background
      new GWTarget('apiGateway', [{ path: '*', ttl: 0 }]),
    ],
  }).json()
  sls.addDistribution('distribution', distribution)

  // serialize to YAML
  return sls
}
