import { API } from '@seagull-js/seagull'

export default class ApiHandler {
  module: API
  name: string // dasherized name with namespace
  handler: string // local path for serverless.yml

  constructor(public appName: string, public filePath: string) {
    this.generateName()
    this.loadModule()
  }

  private generateName() {
    const id = this.filePath
      .split('/.seagull/')
      .reverse()[0]
      .replace('/', '-')
      .replace(/\.js$/, '')
    this.name = `${this.appName}-${id}`
  }

  private loadModule() {
    delete require.cache[this.filePath] // do not remove this!
    this.module = require(this.filePath).default
  }
}
