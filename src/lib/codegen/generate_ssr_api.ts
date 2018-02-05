import Class from './class'
import generateAPI from './generate_api'

export default function generateSsrAPI(): Class {
  const body = `return this.html(renderToString(layout({ children: new Routing(true, request).load() })))`
  const opts = { path: '/*', method: 'GET', body }
  const gen = generateAPI('Frontent', opts)
  gen.addNamedImports('@seagull-js/seagull', ['Routing'])
  gen.addNamedImports('react-dom/server', ['renderToString'])
  gen.addDefaultImport('../frontend/layout', 'layout')
  return gen
}
