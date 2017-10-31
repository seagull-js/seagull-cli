import * as browserify from 'browserify'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as streamToString from 'stream-to-string'
import * as tsify from 'tsify'

export default async function load(folder: string): Promise<string> {
  const file = join(
    folder,
    'node_modules',
    '@seagull-js',
    'seagull',
    'src',
    'lib',
    'spa',
    'entry.tsx'
  )
  const data: string = await streamToString(
    browserify()
      .add(file)
      .plugin(tsify, { noImplicitAny: false })
      .bundle()
  )
  return data
}
