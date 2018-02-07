import { join } from 'path'
import * as shell from 'shelljs'

export function binPath(name: string): string {
  return join('node_modules', '.bin', name)
}

export function cleanBuildDirectory() {
  shell.rm('-rf', '.seagull')
}
