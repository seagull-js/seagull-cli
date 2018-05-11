import { existsSync } from 'fs'
import { filter, union } from 'lodash'
import * as dir from 'node-dir'
import { join } from 'path'
import JobHandler from './job_handler'

export { JobHandler }

// requires the full (absolute) path to the project's folder
export default function loader(appName: string, folder: string): JobHandler[] {
  if (!existsSync(folder)) {
    return []
  }
  const handlers = dir
    .files(folder, { sync: true })
    .filter(file => /\.(ts)|(js)$/.test(file))
    .filter(file => !(file as string).endsWith('.d.ts'))
    .map(file => new JobHandler(appName, file))
  return handlers
}
