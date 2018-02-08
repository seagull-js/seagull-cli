import GenFunction from './function'

export default function(name: string, classic?: boolean): GenFunction {
  if (classic) {
    throw new Error('unimplemented')
  } else {
    const gen = new GenFunction(name)
    gen.addDefaultImport('react', 'React', true)
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
}
