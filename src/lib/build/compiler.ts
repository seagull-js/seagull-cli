import { readFileSync, unlinkSync } from 'fs'
import { extname, join, relative } from 'path'
import * as shell from 'shelljs'
import * as ts from 'typescript'
import { log } from '../logger'
import { binPath } from './helper'

// polyfill
;(Symbol as any).asyncIterator =
  Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator')

export class Compiler {
  // useful so we can get semantic errors
  // incremental tsc compiling does only support syntactic checking
  static compile() {
    shell.config.fatal = true
    shell.exec(`${binPath('tsc')}`)
  }

  private conf: ts.ParsedCommandLine
  private host: ts.WatchCompilerHostOfFilesAndCompilerOptions<ts.BuilderProgram>
  private tsc: ts.WatchOfFilesAndCompilerOptions<ts.BuilderProgram>
  private watchedFiles: string[]
  private wait: {
    compile?: Promise<null>
    resolve?: () => void
  }
  private counter = 0

  constructor() {
    // ts config
    const tsConfig = JSON.parse(
      readFileSync(join(process.cwd(), 'tsconfig.json'), 'utf-8')
    )
    // load and configure tsc config object
    this.conf = ts.parseJsonConfigFileContent(tsConfig, ts.sys, process.cwd())
    this.conf.options.diagnostics = true
    this.conf.options.extendedDiagnostics = true

    // create host config
    this.host = ts.createWatchCompilerHost(
      this.conf.fileNames,
      this.conf.options,
      ts.sys,
      undefined
    )

    this.host.trace = this.onTrace.bind(this)
    this.host.onWatchStatusChange = this.onWatchStatusChange.bind(this)
    this.host.afterProgramCreate = this.onCompilerMessage.bind(this)
    this.watchedFiles = this.conf.fileNames
    // set first compile promise
    this.createCompilePromise()
  }

  // start watching compilation
  watch = async function*(this: Compiler) {
    this.tsc = ts.createWatchProgram(this.host)
    while (true) {
      await this.wait.compile
      this.createCompilePromise()
      yield
    }
  }

  private createCompilePromise() {
    const resolver = resolve => {
      this.wait.resolve = resolve
    }
    this.wait = {}
    this.wait.compile = new Promise(resolver)
  }

  private onTrace(message: string) {
    log('INPUT', message)
    // todo return if not watched path

    // increment / resolve on deletion for bundle
    // investigate renaming
    // folders....


    // example: FileWatcher:: Trigger: $absolutePath 1 PathInfo: $absolutePath
    if (!message.includes(':: Trigger:')) {
      return
    }

    const triggeredFile = message
      .match(/Trigger: (.*?) \d?\s?PathInfo:/)[1]
      .toLowerCase()

    // changed
    if (message.includes('1 PathInfo')) {
      this.counter++
      log(message)
      return
    }

    // renamed, old name is gone
    if (message.includes('2 PathInfo')) {
      this.watchedFiles = this.watchedFiles.filter(
        file => file !== triggeredFile
      )
      this.tsc.updateRootFileNames(this.watchedFiles)
      let compiledFile = join(
        '.seagull',
        'dist',
        relative(process.cwd().toLowerCase(), triggeredFile)
      )
      const ext = extname(compiledFile)
      compiledFile = compiledFile.replace(RegExp(`${ext}$`), '')
      unlinkSync(compiledFile + '.js')
      unlinkSync(compiledFile + '.js.map')
      log('Removing file', triggeredFile)
      return
    }

    // added file
    Object.keys(this.conf.wildcardDirectories).forEach(path => {
      if (
        this.tsc &&
        triggeredFile.startsWith(path) &&
        this.watchedFiles.indexOf(triggeredFile) < 0
      ) {
        this.counter++
        log('Watching new file:', triggeredFile)
        this.watchedFiles = this.watchedFiles.concat(triggeredFile)
        this.tsc.updateRootFileNames(this.watchedFiles)
      }
    })
  }

  private onWatchStatusChange(diagnostic: ts.Diagnostic, newline: string) {
    switch (diagnostic.code) {
      case 6032:
        // log('Started compilation')
        break
      case 6042:
        if (this.counter === 1) {
          log('Compile finished. Waiting for file changes')
        }
        if (this.counter > 0) {
          this.counter--
          this.wait.resolve()
        }
        break
      default:
        break
    }
  }

  private onCompilerMessage(programInfo: ts.BuilderProgram) {
    programInfo.emit()
    const diagnostics = programInfo.getSyntacticDiagnostics()
    diagnostics.forEach(diagnostic => {
      this.logDiagnostic(diagnostic)
    })
  }

  private logDiagnostic(dg: ts.Diagnostic) {
    const message = ts.flattenDiagnosticMessageText(dg.messageText, '\n')

    if (!dg.file) {
      log(`  Error: ${message}`)
      return
    }

    const pos = dg.file.getLineAndCharacterOfPosition(dg.start!)
    log(
      `Error ${dg.file.fileName} (${pos.line + 1},${pos.character +
        1}): ${message}`
    )
  }
}
