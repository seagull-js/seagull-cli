import { GWEndpoint } from './gwEndpoint'
import { Target } from './target'

export class GWTarget extends Target<GWEndpoint> {
  endpointClass = GWEndpoint
  get targetId() {
    return `apiGW-${this.targetShortId}`
  }

  config() {
    return {
      CustomOriginConfig: {
        OriginProtocolPolicy: 'match-viewer',
      },
      DomainName: {
        'Fn::Join': [
          '',
          [
            {
              Ref: 'ApiGatewayRestApi',
            },
            '.execute-api.${self:provider.region}.amazonaws.com',
          ],
        ],
      },
      Id: this.targetId,
      OriginPath: '/${self:provider.stage}',
    }
  }
}
