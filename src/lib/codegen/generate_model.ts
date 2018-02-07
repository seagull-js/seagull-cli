import Class from './class'

export interface IOptions {
  fields: Array<{
    name: string
    type: string
    initial: string
  }>
}

export default function generateModel(name: string, options: IOptions): Class {
  const gen = new Class(name, 'Model')
  gen.addNamedImports('@seagull-js/seagull', ['field', 'Model'])
  if (!options.fields || !options.fields.length) {
    return gen
  }
  for (const field of options.fields) {
    if (!field.name || !field.type || !field.initial) {
      continue
    }
    gen.addProp({
      decorators: [{ name: 'field' }],
      name: field.name,
      type: field.type,
      value: field.initial,
    })
  }
  return gen
}
