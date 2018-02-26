import Class from './class'
import generateAPI from './generate_api'

export default function generateSsrAPI(): Class {
  const body = `
    const appRouter = new Routing(true, request)
    const page = appRouter.initialMatchedPage()
    if (page && typeof page.componentDidMount === 'function'){
      await page.componentDidMount()
    }
    const content = renderToString(appRouter.load())
    const html = renderToString(layout({content}))
    return this.html(html)
  `
  const opts = { path: '/*', method: 'GET', body }
  const gen = generateAPI('Frontent', opts)
  gen.addNamedImports('@seagull/core', ['Routing'])
  gen.addNamedImports('react-dom/server', ['renderToString'])
  gen.addDefaultImport('../../frontend/layout', 'layout')
  return gen
}
