import { Command, command, metadata } from 'clime'

@command({
  description: 'Show short seagull tutorial',
})
export default class extends Command {
  @metadata
  execute() {
    return 'short seagull tutorial' // todo
  }
}