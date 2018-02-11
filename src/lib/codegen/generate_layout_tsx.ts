import GenFunction from './function'

export default function generateLayoutTsx(appName: string): GenFunction {
  const gen = new GenFunction('Layout')
  gen.addDefaultImport('react', 'React', true)
  gen.addNamedImports('@seagull/core', ['Favicons'])
  gen.addParam('{ children }')
  gen.setBodyText(`
  return (
    <html>
      <head>
        <title>${appName}</title>
        <Favicons favicons={['favicon.ico']} />
      </head>
      <body>
        <div id='root'>{children}</div>
        <script src='/assets/bundle.js'></script>
      </body>
    </html>
  );
  `)
  return gen
}
