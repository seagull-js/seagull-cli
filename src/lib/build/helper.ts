import { existsSync, readFileSync, writeFileSync } from 'fs'
import * as dir from 'node-dir'
import { join } from 'path'
import * as shell from 'shelljs'
import App from '../loader/app'
import generateSLS from '../serverless/generate-sls-config'

export function binPath(name: string): string {
  return join(__dirname, '..', '..', '..', 'node_modules', '.bin', name)
}

export function cleanBuildDirectory() {
  shell.rm('-rf', '.seagull')
}

export function lint(): void {
  shell.exec(`${binPath('tslint')} -c tslint.json --fix src/**/*.ts`)
}

export function prettier(): void {
  const args = '--single-quote --no-semi --trailing-comma es5'
  const cmd = `${binPath(
    'prettier'
  )} ${args} --write frontend/**/*.ts backend/**/*.ts`
  shell.exec(cmd, { silent: true })
}

export function copyAssets() {
  if (!existsSync(join('frontend', 'assets'))) {
    return
  }
  const files = dir.files('frontend/assets', { sync: true })
  if (!files || files.length === 0) {
    return
  }
  shell.cp('-R', 'frontend/assets/*', '.seagull/assets')
}

export function initFolder() {
  if (existsSync(join(shell.pwd().toString(), '.seagull'))) {
    cleanBuildDirectory()
  }
  shell.mkdir('-p', '.seagull')
  shell.cp('package.json', '.seagull/package.json')
  // dont link existing link
  if (!existsSync(join(shell.pwd().toString(), '.seagull', 'node_modules'))) {
    shell.ln('-s', '../node_modules', `./.seagull/node_modules`)
  }
  shell.mkdir('-p', '.seagull/assets')
}

export function createServerlessYaml(accountId: string) {
  const pwd = shell.pwd().toString()
  const app = new App(pwd)

  const yml = generateSLS(app, { accountId }).toYAML()
  const ymlPath = join(pwd, '.seagull', 'serverless.yml')
  writeFileSync(ymlPath, yml)
}
