import { Job } from '@seagull/core'
import * as decache from 'decache'
import tsnode = require('ts-node')
tsnode.register()

export default class JobHandler {
  module: typeof Job
  name: string // dasherized name with namespace
  handler: string // local path for serverless.yml

  constructor(public appName: string, public filePath: string) {
    this.generateName()
    this.generateHandler()
    this.loadModule()
  }

  private generateName() {
    const id = this.filePath
      .split('/jobs/')
      .reverse()[0]
      .replace(/\//g, '-')
      .replace(/\.ts$/, '')
      .replace(/\.js$/, '')
    this.name = `job-${id}`
  }

  private generateHandler() {
    const id = this.filePath
      .split('/jobs/')
      .reverse()[0]
      .replace(/\.ts$/, '.handler')
      .replace(/\.js$/, '.handler')
    this.handler = `dist/backend/jobs/${id}`
  }

  private loadModule() {
    decache(this.filePath)
    this.module = require(this.filePath).default
  }
}
