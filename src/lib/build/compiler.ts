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
  }

  // start watching compilation
  watch() {
    ts.createWatchProgram(this.host)
  }

  onTrace(message: string) {
    log('trace', message)
  }

  onWatchStatusChange(diagnostric: ts.Diagnostic, newline: string) {
    log('watch', diagnostric, newline)
  }

  onCompilerMessage(programInfo: ts.BuilderProgram) {
    log('onCompilerMessage', programInfo)
    const allDiagnostics = [].concat(programInfo.getSyntacticDiagnostics())

    allDiagnostics.forEach(diagnostic => {
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      )
      if (diagnostic.file) {
        const {
          line,
          character,
        } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!)
        log(
          `  Error ${diagnostic.file.fileName} (${line + 1},${character +
            1}): ${message}`
        )
      } else {
        log(`  Error: ${message}`)
      }
    })
  }
}
