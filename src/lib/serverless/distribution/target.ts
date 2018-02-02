import { flatten, get, head, map, merge, omit } from 'lodash'
import { Endpoint, IEndpointConstructor } from './endpoint'

export abstract class Target<T extends Endpoint> {
  id: string
  paths: IEndpointConstructor[]
  targetShortId: string
  abstract endpointClass: {
    new (origin: string, opt?: IEndpointConstructor): T
  }

  constructor(targetShortId: string, paths: IEndpointConstructor[]) {
    this.paths = paths
  }

  endpoints(): T[] {
    return flatten(
      this.paths.map(endpoint => {
        const path = endpoint.path.replace(/\/$/, '')
        return [new this.endpointClass(this.targetId, { ...endpoint, path })]
      })
    )
  }

  defaultEndpoint(): T {
    return new this.endpointClass(this.targetId)
  }

  abstract config(): {}
  abstract get targetId(): string
}
