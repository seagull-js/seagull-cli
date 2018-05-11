import * as decache from 'decache'
import { readFileSync } from 'fs'
import { join } from 'path'
import { ApiHandler, default as apiLoader } from './api'
import { default as jobLoader, JobHandler } from './jobs'
import { DdbModel, default as modelLoader } from './models'
import { default as shrimpLoader } from './shrimps'

// abstracts away all non-generated code inside the .seagull folder
export default class App {
  backend: ApiHandler[] = []
  jobs: JobHandler[] = []
  name: string = ''
  package: any // package.json
  frontend: string
  models: DdbModel[] = []
  shrimps: string[] = []

  // requires the full (absolute) path to the users' project .seagull folder
  constructor(public folder: string) {
    this.loadPackageJson()
    this.loadApiHandlers()
    this.loadJobHandlers()
    this.loadDdbModels()
    this.loadShrimps()
  }

  async loadFrontendBundle() {
    this.frontend = readFileSync(
      join(this.folder, '.seagull', 'assets', 'bundle.js')
    ).toString('utf-8')
  }

  private loadPackageJson() {
    const file = join(this.folder, '.seagull', 'package.json')
    decache(file)
    this.package = require(file)
    this.name = this.package.name
  }

  private loadApiHandlers() {
    const folder = join(this.folder, '.seagull', 'dist', 'backend', 'api')
    this.backend = apiLoader(this.name, folder)
  }

  private loadJobHandlers() {
    const folder = join(this.folder, '.seagull', 'dist', 'backend', 'jobs')
    this.jobs = jobLoader(this.name, folder)
  }

  private loadDdbModels() {
    const folder = join(this.folder, '.seagull', 'dist', 'models')
    this.models = modelLoader(this.name, folder)
  }

  private loadShrimps() {
    const folder = join(this.folder, '.seagull', 'dist', 'backend', 'shrimps')
    this.shrimps = shrimpLoader(this.name, folder)
  }
}
