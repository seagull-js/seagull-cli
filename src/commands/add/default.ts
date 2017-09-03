import { Command, command, metadata } from 'clime'

@command({
  description: 'scaffold something for your app',
})
export default class extends Command {
  @metadata
  execute() {
    return 'list options' // todo
  }
}
