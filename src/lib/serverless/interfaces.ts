export interface IFunctionEvent {
  [source: string]: {
    path: string
    method: string
  }
}

export interface IFunction {
  handler: string
  timeout: number
  events: IFunctionEvent[]
}

export interface ITable {
  Type: string
  Properties: {
    TableName: string
    AttributeDefinitions: Array<{
      AttributeName: string
      AttributeType: string
    }>
    KeySchema: Array<{
      AttributeName: string
      KeyType: string
    }>
    ProvisionedThroughput: {
      ReadCapacityUnits: number
      WriteCapacityUnits: number
    }
  }
}

export interface IIAMRoleStatement {
  Effect: string
  Action: string[]
  Resource: string
}

export interface IProvider {
  name: string
  runtime: string
  timeout: number
  region: string
  stage: string
  iamRoleStatements: IIAMRoleStatement[]
}

export interface IServerless {
  service: string
  frameworkVersion: string
  plugins: string[]
  provider: IProvider
  functions: { [name: string]: IFunction }
  package?: {
    include: string[]
    exclude: string[]
  }
  resources: {
    Resources: { [name: string]: ITable }
  }
}
