import * as browserify from 'browserify'
import * as browserifyInc from 'browserify-incremental'
import { writeFileSync } from 'fs'
import { join } from 'path'
import * as streamToString from 'stream-to-string'
import * as UglifyJS from 'uglify-es'

export class Bundler {
  private minify = false
  private browserify
  private browserifyInc

  constructor(minify = false) {
    this.minify = minify

    this.browserify = browserify(
      Object.assign({ ignoreMissing: true }, browserifyInc.args, {})
    )
    this.browserifyInc = browserifyInc(this.browserify, {
      cacheFile: '.seagull/browserify-cache.json',
    })
  }

  async bundle() {
    const src = join(
      process.cwd(),
      '.seagull',
      'node_modules',
      '@seagull-js',
      'seagull',
      'dist',
      'lib',
      'spa',
      'entry.js'
    )

    const data: string = await streamToString(this.browserify.add(src).bundle())
    let blob = data
    if (this.minify) {
      blob = UglifyJS.minify(data).code
    }
    const dist = join(process.cwd(), '.seagull', 'assets', 'bundle.js')
    writeFileSync(dist, blob, { encoding: 'utf-8' })
  }
}
