import { readFileSync } from 'fs'
import { join } from 'path'
import { ApiHandler, default as apiLoader } from './api'
import { DdbModel, default as modelLoader } from './models'

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
    this.frontend = readFileSync(
      join(this.folder, '.seagull', 'assets', 'bundle.js')
    ).toString('utf-8')
  }

  private loadPackageJson() {
    const file = join(this.folder, '.seagull', 'package.json')
    this.package = require(file)
    this.name = this.package.name
  }

  private loadApiHandlers() {
    const folder = join(this.folder, '.seagull', 'dist', 'backend', 'api')
    this.backend = apiLoader(this.name, folder)
  }

  private loadDdbModels() {
    const folder = join(this.folder, '.seagull', 'dist', 'models')
    this.models = modelLoader(this.name, folder)
  }
}
