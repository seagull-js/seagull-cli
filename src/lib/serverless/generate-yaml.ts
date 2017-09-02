import * as inflection from 'inflection'
import App from '../loader/app'
import Builder from './builder'

export default function generate(app: App): string {
  // create instance with defaults
  const sls = new Builder(app.name)

  // add backend routes as serverless functions (lambda + apiG)
  for (const api of app.backend) {
    const { method, path } = api.module
    const event = { http: `${method} ${path}` }
    const fn = { handler: api.handler, timeout: 30, events: [event] }
    sls.addFunction(api.name, fn)
  }

  // serialize to YAML
  return sls.toYAML()
}
