import GenFunction from './function'

export default function generateLayoutTsx(appName: string): GenFunction {
  const gen = new GenFunction('Layout')
  gen.addDefaultImport('react', 'React', true)
  gen.addNamedImports('@seagull/core', ['Favicons', 'Head', 'Body'])
  gen.addParam('{ content }')
  gen.setBodyText(`
  return (
    <html>
      <Head>
        <Favicons favicons={['favicon.ico']} />
      </Head>
      <Body renderedContent={content}>
        <script src='/assets/bundle.js'></script>
      </Body>
    </html>
  );
  `)
  return gen
}
