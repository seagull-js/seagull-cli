import { existsSync } from 'fs'
import { filter, union } from 'lodash'
import * as dir from 'node-dir'
import { join } from 'path'
import DdbModel from './ddb_resource'

export { DdbModel }

// requires the full (absolute) path to the project's folder
export default function loader(appName: string, folder: string): DdbModel[] {
  if (!existsSync(folder)) {
    return []
  }
  return dir
    .files(folder, { sync: true })
    .filter(file => /\.(ts)|(js)$/.test(file))
    .map(file => new DdbModel(appName, file))
}
