import { readFileSync } from 'fs'
import { join } from 'path'
import * as ts from 'typescript'

export function compile(
  fileNames: string[],
  options: ts.CompilerOptions
): void {
  // tslint:disable-next-line:no-console
  console.log(join(process.cwd(), 'tsconfig.json'))
  const jsonConf = JSON.parse(
    readFileSync(join(process.cwd(), 'tsconfig.json'), 'utf-8')
  )
  const host = ts.createCompilerHost(ts.getDefaultCompilerOptions())
  const conf = ts.parseJsonConfigFileContent(jsonConf, ts.sys, process.cwd())

  const program = ts.createProgram(conf.fileNames, conf.options, host)
  conf.options.diagnostics = true
  conf.options.extendedDiagnostics = true
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
  const wprogram = ts.createWatchProgram(whost)

  const emitResult = program.emit()

  const exitCode = emitResult.emitSkipped ? 1 : 0
}
