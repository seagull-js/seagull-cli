import { join } from 'path'
import Json from './json'

export default function generateTslintJson(): Json {
  const gen = new Json()
  // load from CLI base
  const srcFile = join(__dirname, '..', '..', '..', 'tslint.json')
  gen.fromFile(srcFile)
  return gen
}
