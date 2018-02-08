import { readFileSync } from 'fs'
import { join } from 'path'
import * as shell from 'shelljs'
import * as ts from 'typescript'
import { log } from '../logger'
import { binPath } from './helper'

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
  private succesfullCompile: Promise<null>
  private resolveCompile: () => void

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
    this.host.trace = this.onTrace
    this.host.onWatchStatusChange = this.onWatchStatusChange
    this.host.afterProgramCreate = this.onCompilerMessage

    // set first compile promise
    this.succesfullCompile = new Promise(resolve => {
      this.resolveCompile = resolve
    })
  }

  // start watching compilation
  watch = async function*() {
    this.tsc = ts.createWatchProgram(this.host)
    while (true) {
      await this.succesfullCompile
      this.succesfullCompile = new Promise(resolve => {
        this.resolveCompile = resolve
      })
      yield
    }
  }

  private onTrace(message: string) {
    // example: FileWatcher:: Trigger: $absolutePath 1 PathInfo: $absolutePath
    if (message.includes(':: Trigger:') && message.includes('1 PathInfo')) {
      log(message)
    }
  }

  private onWatchStatusChange(diagnostic: ts.Diagnostic, newline: string) {
    switch (diagnostic.code) {
      case 6032:
        // log('Started compilation')
        break
      case 6042:
        log('Compile finished. Waiting for file changes')
        this.resolveCompile()
        break
      default:
        break
    }
  }

  private onCompilerMessage(programInfo: ts.BuilderProgram) {
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
