import App from '../loader/app'
import Builder from './builder'

export default function generate(app: App): string {
  // create instance with defaults
  const sls = new Builder(app.name)

  // add backend routes as serverless functions (lambda + apiG)
  for (const api of app.backend) {
    const { method, path } = api.module as { method: string; path: string }
    let events
    if (path.endsWith('*')) {
      // if you want a wildcard you WANT a url like 'bla/*'
      // -> 'bla*' is forbidden
      const proxyPath = path.replace(/\/+\*$/, '')
      events = [
        { http: { method, path: `${proxyPath}/` } },
        { http: { method, path: `${proxyPath}/{proxy+}` } },
      ]
    } else {
      events = [{ http: { method, path } }]
    }
    const fn = { handler: api.handler, timeout: 30, events }
    sls.addFunction(api.name, fn)
  }

  for (const model of app.models) {
    const table = {
      Properties: {
        AttributeDefinitions: [
          {
            AttributeName: 'id',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'id',
            KeyType: 'HASH',
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: model.reads,
          WriteCapacityUnits: model.writes,
        },
        TableName: `${model.appName}-${model.name}`,
      },
      Type: 'AWS::DynamoDB::Table',
    }
    sls.addTable(model.name, table)
  }

  // serialize to YAML
  return sls.toYAML()
}
