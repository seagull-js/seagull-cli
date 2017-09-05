import { API } from '@seagull-js/seagull'
import tsnode = require('ts-node')
tsnode.register({ fast: true })

export default class ApiHandler {
  module: API
  name: string // dasherized name with namespace
  handler: string // local path for serverless.yml

  constructor(public appName: string, public filePath: string) {
    this.generateName()
    this.generateHandler()
    this.loadModule()
  }

  private generateName() {
    const id = this.filePath
      .split('/api/')
      .reverse()[0]
      .replace(/\//g, '-')
      .replace(/\.ts$/, '')
    this.name = `api-${id}`
  }

  private generateHandler() {
    const id = this.filePath
      .split('/api/')
      .reverse()[0]
      .replace(/\.ts$/, '.handler')
    this.handler = `dist/api/${id}`
  }

  private loadModule() {
    delete require.cache[this.filePath] // do not remove this!
    this.module = require(this.filePath).default
  }
}
