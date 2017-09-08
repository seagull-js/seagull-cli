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

  // serialize to YAML
  return sls.toYAML()
}
