import * as packageJson from 'package-json'
import { join } from 'path'

export async function getCLIVersions() {
  const latest = await packageJson('@seagull/cli')
  const current = require(join(__dirname, '../../package.json'))
  return { latest: latest.version, current: current.version }
}
