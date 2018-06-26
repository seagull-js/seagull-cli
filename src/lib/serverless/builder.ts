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

  constructor(name: string, region = 'eu-west-1') {
    this.data = this.createDefaultServerless(region)
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

  addSimpleDBDomain(name: string): Builder {
    this.data.resources.Resources[name] = { Type: 'AWS::SDB::Domain' }
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

  getStackName(): string {
    return `${this.data.service}-${this.data.provider.stage}`
  }

  getRegion(): string {
    return this.data.provider.region
  }

  private createDefaultServerless(region = 'eu-west-1'): IServerless {
    return {
      frameworkVersion: '=1.19.0',
      functions: {},
      plugins: [],
      provider: this.createDefaultProvider(region),
      resources: { Resources: {} },
      service: '',
    }
  }

  private createDefaultProvider(region): IProvider {
    return {
      iamRoleStatements: [],
      name: 'aws',
      region,
      runtime: 'nodejs8.10',
      stage: 'dev',
      timeout: 30,
    }
  }
}
