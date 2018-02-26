import * as shell from 'shelljs'
import * as YAML from 'yamljs'

import { getAccountId } from '../../context'

export async function syncS3Data() {
  const slsConfig = YAML.load(`${shell.pwd()}/serverless.yml`)
  const region = slsConfig.provider.region
  const accountId = await getAccountId()
  const name = require(`${shell.pwd()}/package.json`).name.replace(/\s/g, '')
  shell.cd('.seagull')
  shell.exec(
    `aws s3 sync --region=${region} --delete ./dist s3://${name}-${accountId}-assets-bucket`
  )
  shell.cd('..')
}
