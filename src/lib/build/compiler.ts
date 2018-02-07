import { readFileSync } from 'fs'
import { join } from 'path'
import * as ts from 'typescript'
import * as shell from 'shelljs'
import { binPath } from './helper'

export class Compiler {
  conf: ts.ParsedCommandLine
  host: ts.WatchCompilerHostOfFilesAndCompilerOptions<ts.BuilderProgram>

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
    this.host = ts.createWatchCompilerHost(this.conf.fileNames, this.conf.options, ts.sys, undefined)
  }

  // start watching compilation
  watch(){
    ts.createWatchProgram(this.host)
  }

  // useful so we can get semantic errors
  // incremental tsc compiling does only support syntactic checking
  static compile(){
    shell.config.fatal = true
    shell.exec(`${binPath('tsc')}`)
  }
}
/*
export function compile(
  options: ts.CompilerOptions
): void {

  const whost = ts.createWatchCompilerHost(
    conf.fileNames,
    conf.options,
    ts.sys,
    undefined,
    diagnostic => {
      // tslint:disable-next-line:no-console
      console.log('inline', diagnostic)
    }
  )

  whost.afterProgramCreate = acprogram => {
    // tslint:disable-next-line:no-console
    console.log('afterProgramCreate', acprogram)

    const allDiagnostics = [].concat(acprogram.getSyntacticDiagnostics())

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
        // tslint:disable-next-line:no-console
        console.log(
          `  Error ${diagnostic.file.fileName} (${line + 1},${character +
            1}): ${message}`
        )
      } else {
        // tslint:disable-next-line:no-console
        console.log(`  Error: ${message}`)
      }
    })

    return
  }
  // tslint:disable-next-line:no-console
  whost.trace = s => {
    // tslint:disable-next-line:no-console
    console.log('trace', s)
  }
  whost.onWatchStatusChange = (diagnostric, newline) => {
    // tslint:disable-next-line:no-console
    console.log('onwathc', diagnostric, newline)
  }
}
*/