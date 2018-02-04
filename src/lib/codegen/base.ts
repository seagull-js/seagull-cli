import { writeFileSync } from 'fs'
import * as prettier from 'prettier'
import Ast, { IndentationText, QuoteType, SourceFile } from 'ts-simple-ast'
import * as ts from 'typescript'

const astSettings = {
  manipulationSettings: {
    indentationText: IndentationText.TwoSpaces,
    quoteType: QuoteType.Single,
    scriptTarget: ts.ScriptTarget.Latest,
  },
  useVirtualFileSystem: true,
}

const prettierSettings = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
}

/**
 * General Setup for the AST tooling and common functionality for code
 * generation. More specialized file types (like classes, functions) should
 * extend from this class.
 *
 * AST Docs: https://dsherret.github.io/ts-simple-ast/
 */
export default class Base {
  private sourceFile: SourceFile

  constructor() {
    const ast = new Ast(astSettings)
    this.sourceFile = ast.createSourceFile('virtual.ts')
  }

  /**
   * Add a normal import to the file, like `import name from 'module'`
   *
   * @param from module or filepath to load code from
   * @param name how to name the import for further usage
   * @param legacy set this flag to true to get '* as name' syntax
   */
  addDefaultImport(from: string, name: string, legacy?: boolean): this {
    const token = legacy ? `* as ${name}` : name
    const opts = { moduleSpecifier: from, defaultImport: token }
    this.sourceFile.addImportDeclaration(opts)
    return this
  }

  /**
   *  Add multiple named imports to the file, like
   * `import { A, B } from 'module'`.
   *
   * @param from module or filepath to load code from
   * @param names which objects to load from the module
   */
  addNamedImports(from: string, names: string[]): this {
    const namedImports = names.map(name => ({ name }))
    const opts = { moduleSpecifier: from, namedImports }
    this.sourceFile.addImportDeclaration(opts)
    return this
  }

  /**
   * Return textual representation of the current AST state, already prettified
   */
  toString(): string {
    const sourceCode = this.sourceFile.getFullText()
    const prettyCode = prettier.format(sourceCode, prettierSettings)
    return prettyCode
  }

  /**
   * Write the current AST directly to a file, overwrite if file already exists.
   *
   * @param filePath absolute path where the file will get written
   */
  toFile(filePath: string): void {
    writeFileSync(filePath, this.toString(), 'utf-8')
  }
}
