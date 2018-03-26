import * as shell from 'shelljs'
import * as YAML from 'yamljs'

import { getAccountId } from '../../context'

export async function syncS3Data() {
  const slsConfig = YAML.load(`${shell.pwd()}/serverless.yml`)
  const region = slsConfig.provider.region
  const bucketName =
    slsConfig.resources.Resources.appBucket.Properties.BucketName
  shell.exec(
    `aws s3 sync --region=${region} --delete ./assets s3://${bucketName}/assets --cache-control=600`
  )
}
