import GenFunction from './function'

export default function generateLayoutTsx(appName: string): GenFunction {
  const gen = new GenFunction('Layout')
  gen.addDefaultImport('react', 'React', true)
  gen.addParam('{ children }')
  gen.setBodyText(`
  return (
    <html>
      <head>
        <title>${appName}</title>
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
