import chalk from 'chalk'

import {
  Command,
  command,
  Context,
  metadata,
  option,
  Options,
  param,
} from 'clime'
import * as shell from 'shelljs'

import { join } from 'path'
import { getAccountId } from '../lib/context'
import App from '../lib/loader/app'
import { log } from '../lib/logger'
import { hasValidAWSCredentials } from '../lib/serverless/credentials'
import {
  findMainCloudFrontResourceID,
  invalidateDistribution,
} from '../lib/serverless/distribution/util'
import generateSLS from '../lib/serverless/generate-sls-config'
import { syncS3Data } from '../lib/serverless/s3/sync'
import Build from './build'

export class DeployOptions extends Options {
  @option({
    description: 'force the update and overwrite local commits',
    flag: 'p',
    name: 'profile',
    placeholder: 'defaut',
    required: false,
  })
  profile?: string = 'default'
}

// tslint:disable-next-line:max-classes-per-file
@command({ description: 'deploy an app to aws' })
export default class extends Command {
  @metadata
  async execute(options?: DeployOptions) {
    const cwd = shell.pwd()
    const currentProfile = process.env.AWS_PROFILE
    try {
      const profile = options ? options.profile : undefined
      if (hasValidAWSCredentials(profile)) {
        await new Build().execute()
        shell.cd('.seagull')
        logDeployStart()
        shell.exec('sls deploy')
        await syncS3Data()
        await this.invalidateCloudFrontCache()
        logDeployDone()
      } else {
        log(
          chalk.red(`Missing credentials!        
Please provide fitting aws credentials. You can refer an existing profile by 
'sg deploy --profile <profile>' or by env variables. For further information 
consult https://docs.aws.amazon.com/cli/latest/topic/config-vars.html.`)
        )
      }
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e)
    }
    process.env.AWS_PROFILE = currentProfile
    shell.cd(cwd)
  }

  async invalidateCloudFrontCache() {
    const pwd = join(shell.pwd().toString(), '..')

    const app = new App(pwd)

    const accountId = await getAccountId()
    const yml = generateSLS(app, { accountId })
    const region = yml.getRegion()
    const stackName = yml.getStackName()
    const cfId = await findMainCloudFrontResourceID(region, stackName)
    await invalidateDistribution(cfId, ['/*'])
    log(`\nMain CloudFront Distribution invalidated`)
  }
}

function logDeployStart() {
  log(
    `\n${chalk.red(
      `The first deployment may take up to 30min, due to the Cloudfront deployment`
    )}\nPlease be as patient you can... :)\n`
  )
}

function logDeployDone() {
  log(
    `There you go...\n
If your Cloudfront has problems to access your assets\
after the first deployment, be aware that it may take several hours.
Future deployments will be a lot smoother.`
  )
}
