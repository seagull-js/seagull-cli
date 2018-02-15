import Class from './class'
import generateAPI from './generate_api'

export default function generateSsrAPI(): Class {
  const body = `
    const appRouter = new Routing(true, request)
    const page = appRouter.initialMatchedPage()
    await page.componentDidMount()
    return this.html(renderToString(layout({ children: appRouter.load() })))
  `
  const opts = { path: '/*', method: 'GET', body }
  const gen = generateAPI('Frontent', opts)
  gen.addNamedImports('@seagull/core', ['Routing'])
  gen.addNamedImports('react-dom/server', ['renderToString'])
  gen.addDefaultImport('../../frontend/layout', 'layout')
  return gen
}
