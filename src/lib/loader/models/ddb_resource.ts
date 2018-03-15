import { Model } from '@seagull/core'
import tsnode = require('ts-node')
tsnode.register()

export default class DdbModel {
  schema: { [key: string]: string }
  name: string // dasherized name with namespace
  reads: number
  writes: number

  constructor(public appName: string, public filePath: string) {
    this.loadModel()
  }

  private loadModel() {
    delete require.cache[this.filePath] // do not remove this!
    const BaseClass = require(this.filePath).default
    this.reads = BaseClass.readsPerSecond
    this.writes = BaseClass.writesPerSecond
    const instance = new BaseClass() as Model
    this.schema = instance._interface
    this.name = instance._name
  }
}
