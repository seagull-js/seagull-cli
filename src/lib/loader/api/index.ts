import { existsSync } from 'fs'
import { filter, union } from 'lodash'
import * as dir from 'node-dir'
import { join } from 'path'
import ApiHandler from './api_handler'

export { ApiHandler }

// requires the full (absolute) path to the project's .seagull/api folder
export default function loader(appName: string, folder: string): ApiHandler[] {
  if (!existsSync(folder)) {
    return []
  }
  const handlers = dir
    .files(folder, { sync: true })
    .filter(file => /\.ts$/.test(file))
    .map(file => new ApiHandler(appName, file))
  return sorted(handlers)

}

// very naive for now, but works for basic apps
function sorted (apis: ApiHandler[]): ApiHandler[] {
  const regular = filter(apis, api => api.module.path !== '/*')
  const greedy = filter(apis, api => api.module.path === '/*')
  return union(regular, greedy)
}
