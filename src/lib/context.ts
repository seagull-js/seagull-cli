import { STS } from 'aws-sdk'

export async function getAccountId(): Promise<string> {
  if (process.env.NODE_ENV === 'test') {
    // tests
    return 'TESTACCOUNTID'
  }
  const stsService = new STS()
  // just let it crash if credentials invalid/not provided for now
  const result = await stsService.getCallerIdentity().promise()
  return result.Account
}
