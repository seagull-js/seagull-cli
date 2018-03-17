import { PackageJson } from '@seagull/package-config'
import { existsSync } from 'fs'
import { filter, union } from 'lodash'
import * as dir from 'node-dir'
import { join } from 'path'

const pkg = new PackageJson()

// requires the full (absolute) path to the project's folder
export default function loader(appName: string, folder: string): string[] {
  if (!existsSync(folder)) {
    return []
  }
  return dir
    .files(folder, { sync: true })
    .filter(file => /\.(ts)|(js)$/.test(file))
    .filter(file => !(file as string).endsWith('.d.ts'))
    .map(file => require(file).default)
    .map(shrimp => `${pkg.name}-${new shrimp()._name}`)
}
