import GenFunction from './function'

export default function generateLayoutTsx(): GenFunction {
  const gen = new GenFunction('Layout')
  gen.addDefaultImport('react', 'React', true)
  gen.addParam('{ children }')
  gen.setBodyText(`
  return (
    <html>
      <head>
        <title>APP_NAME</title>
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
