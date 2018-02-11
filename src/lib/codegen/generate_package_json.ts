import { join } from 'path'
import Json from './json'

export default function generatePackageJson(name: string): Json {
  const gen = new Json()
  // basic info
  gen.set('name', name)
  gen.set('version', '0.1.0')
  gen.set('description', 'my new seagull app')
  gen.set('private', true)
  // enforce node version for lambda compatibility
  gen.set('engineStrict', true)
  gen.set('engines', { node: '>= 6.10.3 < 7' })
  // add dependencies
  gen.set('dependencies', { '@seagull/core': `^${frameworkVersion()}` })
  gen.set('devDependencies', {
    '@types/history': '^4.6.0',
    '@types/node': '^8.0.25',
    '@types/react': '^16.0.10',
    '@types/react-dom': '^16.0.1',
    '@types/react-router': '^4.0.15',
    '@types/react-router-config': '^1.0.4',
    '@types/react-router-dom': '^4.0.8',
  })
  return gen
}

function frameworkVersion(): string {
  const file = join(__dirname, '..', '..', '..', 'package.json')
  const pkg = require(file)
  return pkg.dependencies['@seagull/core']
}
