import Class from './class'

export interface IOptions {
  path: string
}

export default function generatePage(name: string, options: IOptions): Class {
  const gen = new Class(name, 'Page<{}, {}>')
  gen.addDefaultImport('react', 'React', true)
  gen.addNamedImports('@seagull/core', ['Page'])

  const docPath = `the url path this page will be mounted on`
  gen.addProp({
    doc: docPath,
    name: 'path',
    static: false,
    type: 'string',
    value: `'${options.path}'`,
  })

  const docRender = `outputs the HTML of this Page`
  const body = `
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  )`
  gen.addMethod({
    body,
    doc: docRender,
    name: 'render',
    parameter: [],
    returnType: undefined,
  })

  return gen
}
