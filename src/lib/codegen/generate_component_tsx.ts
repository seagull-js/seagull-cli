import GenClass from './class'
import GenFunction from './function'

export type Gen = GenFunction | GenClass

export default function(name: string, classic?: boolean): Gen {
  const gen = classic ? generateClass(name) : generateFunction(name)
  gen.addDefaultImport('react', 'React', true)
  return gen
}

function generateClass(name: string): GenClass {
  const gen = new GenClass(name, 'React.Component<{}, {}>')
  gen.addConstructor({
    bodyText: 'super(props)\n this.state = {}',
    parameters: [{ name: 'props', type: undefined }],
  })
  const docRender = `outputs the HTML of this Page`
  const bodyRender = `
    return (
      <div>
        <h1>Hello World!</h1>
      </div>
    )`
  gen.addMethod({
    body: bodyRender,
    doc: docRender,
    name: 'render',
    parameter: [],
    returnType: undefined,
  })
  return gen
}

function generateFunction(name: string): GenFunction {
  const gen = new GenFunction(name)
  gen.addParam('{ children }')
  gen.setBodyText(`
    return (
      <>
        <div>replace me!</div>
      </>
    );
    `)
  return gen
}
