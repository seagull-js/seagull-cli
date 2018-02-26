import * as aws from 'aws-sdk'
import * as fs from 'fs'
import * as readline from 'readline'

import { IAWSCredentials } from './interfaces'

/**
 * From: https://docs.aws.amazon.com/cli/latest/topic/config-vars.html
 *
 * Credentials from environment variables have precedence over credentials
 * from the shared credentials and AWS CLI config file. Credentials specified
 * in the shared credentials file have precedence over credentials in the AWS
 * CLI config file. If AWS_PROFILE environment variable is set and the
 * AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are set,
 * then the credentials provided by AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
 * will override the credentials located in the profile provided by AWS_PROFILE.
 */

export function hasValidAWSCredentials(profile?: string): boolean {
  const creds = new aws.SharedIniFileCredentials({ profile })
  if (profile && creds.accessKeyId && creds.secretAccessKey) {
    aws.config.credentials = creds
    process.env.AWS_PROFILE = profile
    return true
  }
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    return true
  }
  const altCreds = new aws.SharedIniFileCredentials({
    profile: process.env.AWS_PROFILE ? process.env.AWS_PROFILE : 'default',
  })
  if (altCreds.accessKeyId && altCreds.secretAccessKey) {
    aws.config.credentials = altCreds
    return true
  }
  return false
}
