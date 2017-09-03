import { join } from 'path'
import { ApiHandler, default as apiLoader } from './api'

// abstracts away all non-generated code inside the .seagull folder
export default class App {
  backend: ApiHandler[] = []
  name: string = ''
  package: any // package.json

  // requires the full (absolute) path to the users' project .seagull folder
  constructor(public folder: string) {
    this.loadPackageJson()
    this.loadApiHandlers()
  }

  private loadPackageJson() {
    const file = join(this.folder, 'package.json')
    this.package = require(file)
    this.name = this.package.name
  }

  private loadApiHandlers() {
    const folder = join(this.folder, 'dist', 'api')
    this.backend = apiLoader(this.name, folder)
  }
}