import * as YAML from 'yamljs'
import {
  IDistribution,
  IDistributionAccessIdentity,
  IFunction,
  IIAMRoleStatement,
  IProvider,
  IS3Bucket,
  IS3BucketPermission,
  IServerless,
  ITable,
} from './interfaces'

export default class Builder {
  private data: IServerless

  constructor(name: string) {
    this.data = this.createDefaultServerless()
    this.data.service = name
  }

  addIAMRoleStatement(item: IIAMRoleStatement): Builder {
    this.data.provider.iamRoleStatements.push(item)
    return this
  }

  addPlugin(item: string): Builder {
    this.data.plugins.push(item)
    return this
  }

  addFunction(name: string, fn: IFunction): Builder {
    this.data.functions[name] = fn
    return this
  }

  addTable(name: string, table: ITable): Builder {
    this.data.resources.Resources[name] = table
    return this
  }

  addDistribution(name: string, distribution: IDistribution): Builder {
    this.data.resources.Resources[name] = distribution
    return this
  }

  addS3Bucket(name: string, bucket: IS3Bucket): Builder {
    this.data.resources.Resources[name] = bucket
    return this
  }

  addS3BucketPermission(
    name: string,
    bucketPermission: IS3BucketPermission
  ): Builder {
    this.data.resources.Resources[name] = bucketPermission
    return this
  }

  addDistributionAccessIdentity(
    name: string,
    accessIdentity: IDistributionAccessIdentity
  ): Builder {
    this.data.resources.Resources[name] = accessIdentity
    return this
  }

  toYAML(): string {
    // Use json.parse/stringify to remove undefined values from json
    // yml.stringify would insert null for them...
    const json = JSON.parse(JSON.stringify(this.data))
    // second param -> how deep we use yml until we use inline yml (json)
    // third param -> indention
    return YAML.stringify(json, 42, 2)
  }

  private createDefaultServerless(): IServerless {
    return {
      frameworkVersion: '=1.19.0',
      functions: {},
      plugins: [],
      provider: this.createDefaultProvider(),
      resources: { Resources: {} },
      service: '',
    }
  }

  private createDefaultProvider(): IProvider {
    return {
      iamRoleStatements: [],
      name: 'aws',
      region: 'eu-central-1',
      runtime: 'nodejs6.10',
      stage: 'dev',
      timeout: 30,
    }
  }
}
