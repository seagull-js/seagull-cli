import Class from './class'
import generateAPI from './generate_api'

export default function generateSsrAPI(): Class {
  const body = `
    const appRouter = new Routing(true, request)
    const page = appRouter.initialMatchedPage()
    if (page && typeof page.componentDidMount === 'function'){
      await page.componentDidMount()
    }
    const html = renderToString(layout({ children: appRouter.load() }))
    return this.html(html.replace('<head>', \`<head><style>\${getStyles()}</style>\`))
  `
  const opts = { path: '/*', method: 'GET', body }
  const gen = generateAPI('Frontent', opts)
  gen.addNamedImports('@seagull/core', ['Routing'])
  gen.addNamedImports('react-dom/server', ['renderToString'])
  gen.addNamedImports('typestyle', ['getStyles'])
  gen.addDefaultImport('../../frontend/layout', 'layout')
  return gen
}
