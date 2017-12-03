import { join } from 'path'
import { ApiHandler, default as apiLoader } from './api'
import { DdbModel, default as modelLoader } from './models'

import loadFrontendBundle from './frontend/'

// abstracts away all non-generated code inside the .seagull folder
export default class App {
  backend: ApiHandler[] = []
  name: string = ''
  package: any // package.json
  frontend: string
  models: DdbModel[] = []

  // requires the full (absolute) path to the users' project .seagull folder
  constructor(public folder: string) {
    this.loadPackageJson()
    this.loadApiHandlers()
    this.loadDdbModels()
  }

  async loadFrontendBundle() {
    this.frontend = await loadFrontendBundle(this.folder)
  }

  private loadPackageJson() {
    const file = join(this.folder, 'package.json')
    this.package = require(file)
    this.name = this.package.name
  }

  private loadApiHandlers() {
    if (/\.seagull/.test(this.folder)) {
      const folder = join(this.folder, 'dist', 'backend', 'api')
      this.backend = apiLoader(this.name, folder)
    } else {
      const folder = join(this.folder, 'backend', 'api')
      this.backend = apiLoader(this.name, folder)
    }
  }

  private loadDdbModels() {
    if (/\.seagull/.test(this.folder)) {
      const folder = join(this.folder, 'dist', 'models')
      this.models = modelLoader(this.name, folder)
    } else {
      const folder = join(this.folder, 'models')
      this.models = modelLoader(this.name, folder)
    }
  }
}
