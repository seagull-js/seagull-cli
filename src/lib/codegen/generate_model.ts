import Class from './class'

export interface IOptions {
  fields: Array<{
    name: string
    type: string
    initial: string
  }>
}

export default function generateAPI(name: string, options: IOptions): Class {
  const gen = new Class(name, 'Model')
  gen.addNamedImports('@seagull-js/seagull', ['field', 'Model'])
  for (const field of options.fields) {
    gen.addProp({
      decorators: [{ name: 'field' }],
      name: field.name,
      type: field.type,
      value: field.initial,
    })
  }
  return gen
}
