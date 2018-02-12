import { Command, command, Context, metadata, param } from 'clime'
import * as shell from 'shelljs'

import { log } from '../lib/logger'
import { retrieveCredentials } from '../lib/serverless/credentials'
import { syncS3Data } from '../lib/serverless/s3/sync'
import Build from './build'

@command({ description: 'deploy an app to aws' })
export default class extends Command {
  @metadata
  execute() {
    const cwd = shell.pwd()
    try {
      const credentials = retrieveCredentials()
      if (credentials.accessKeyId && credentials.secretAccessKey) {
        new Build().execute()
        shell.cd('.seagull')
        shell.exec('sls deploy')
        // TODO: sync s3
        syncS3Data()
      } else {
        log('Missing credentials!')
      }
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e)
    }
    shell.cd(cwd)
  }
}
