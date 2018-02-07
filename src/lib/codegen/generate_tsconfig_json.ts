import { join } from 'path'
import Json from './json'

export default function generateTsconfigJson(): Json {
  const gen = new Json()
  // load from CLI base
  const srcFile = join(__dirname, '..', '..', '..', 'tsconfig.json')
  gen.fromFile(srcFile)
  // modify for folder structure specifics
  gen.update('compilerOptions', opts => {
    opts.rootDir = './'
    opts.outDir = './.seagull/dist'
  })
  // ambient settings
  gen.set('lib', ['es5', 'es6', 'es7', 'dom', 'dom.iterable'])
  gen.set('include', [
    'backend/**/*',
    'frontend/**/*',
    'models/**/*',
    'test/**/*',
  ])

  return gen
}
