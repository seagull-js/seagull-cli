import { Command, command, Context, metadata, param } from 'clime'
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as shell from 'shelljs'
import { lint, prettier } from '../lib/build/helper'

@command({ description: 'normalize code style and formatting' })
export default class extends Command {
  @metadata
  execute() {
    if (process.env.NODE_ENV !== 'test') {
      lint()
      prettier()
    }
  }
}
