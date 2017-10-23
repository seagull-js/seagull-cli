import App from '../loader/app'
import Builder from './builder'

export default function generate(app: App): string {
  // create instance with defaults
  const sls = new Builder(app.name)

  // add backend routes as serverless functions (lambda + apiG)
  for (const api of app.backend) {
    const { method, path } = api.module as any
    const event = { http: `${method} ${path}` }
    const events = [event]
    if (method === 'GET' && path === '/*') {
      events.push({ http: `${method} /` }) // special case, not covered by '/*'
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
