import { join } from 'path'
import * as shell from 'shelljs'

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
  const cmd = `${binPath('prettier')} ${args} --write src/**/*.ts`
  shell.exec(cmd, { silent: true })
}