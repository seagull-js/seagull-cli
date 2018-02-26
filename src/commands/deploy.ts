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

import { log } from '../lib/logger'
import { hasValidAWSCredentials } from '../lib/serverless/credentials'
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
        shell.exec('sls deploy')
        await syncS3Data()
      } else {
        log(
          `Missing credentials!        
Please provide fitting aws credentials. You can refer an existing profile by 
'sg deploy --profile <profile>' or by env variables. For further information 
consult https://docs.aws.amazon.com/cli/latest/topic/config-vars.html.`
        )
      }
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e)
    }
    process.env.AWS_PROFILE = currentProfile
    shell.cd(cwd)
  }
}
