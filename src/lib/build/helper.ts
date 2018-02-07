import { join } from 'path'

export function binPath(name: string): string {
  return join(__dirname, '..', '..', 'node_modules', '.bin', name)
}