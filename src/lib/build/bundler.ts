import * as browserify from 'browserify'
import * as browserifyIncremental from 'browserify-incremental'
import { writeFileSync } from 'fs'
import { join } from 'path'
import * as streamToString from 'stream-to-string'
import * as UglifyJS from 'uglify-es'
import { log } from '../logger'

const entry = join(
  '.seagull',
  'node_modules',
  '@seagull-js',
  'seagull',
  'dist',
  'lib',
  'spa',
  'entry.js'
)

export class Bundler {

  static async bundle(minify = false) {
    const bfy = browserify({ignoreMissing: true})
    const stream = bfy.add(join(process.cwd(), entry)).bundle()
    const bundle = minify 
      ? UglifyJS.minify(await streamToString(stream)).code
      : await streamToString(stream) 
  
    const dist = join(process.cwd(), '.seagull', 'assets', 'bundle.js')
    writeFileSync(dist, bundle, { encoding: 'utf-8' })

  }

  private minify = false
  private browserify
  private browserifyIncremental
  private incrementalCache = {}
  private incrementalPackageCache = {}


  constructor(minify = false) {
    this.minify = minify
    const browserifyArgs = {
      cache: this.incrementalCache,
      fullPaths:true,
      ignoreMissing: true,
      packageCache: this.incrementalPackageCache,
    }

    this.browserify = browserify(browserifyArgs)
    this.browserifyIncremental = browserifyIncremental(this.browserify)
    this.browserify = this.browserify.add(join(process.cwd(), entry))
    this.browserify.on('time', (time) => {
      log(' Bundling took(ms):', time)
    })
  }

  async bundle(): Promise<string> {
    const stream = this.browserify.bundle()
    const bundle = this.minify 
      ? UglifyJS.minify(await streamToString(stream)).code
      : await streamToString(stream) 
  
    const dist = join(process.cwd(), '.seagull', 'assets', 'bundle.js')
    writeFileSync(dist, bundle, { encoding: 'utf-8' })
    return bundle
  }
}
