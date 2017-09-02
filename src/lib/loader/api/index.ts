import { existsSync } from 'fs'
import * as dir from 'node-dir'
import { join } from 'path'
import ApiHandler from './api_handler'

export { ApiHandler }

// requires the full (absolute) path to the project's .seagull/api folder
export default function loader(appName: string, folder: string): ApiHandler[] {
  if (!existsSync(folder)) {
    return []
  }
  return dir
    .files(folder, { sync: true })
    .filter(file => /\.js$/.test(file))
    .map(file => new ApiHandler(appName, file))
}
