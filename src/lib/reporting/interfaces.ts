export interface IPirateEvent {
  uuid: string // persistent user id
  timestamp: number // unix timestamp
  name: string // 'activation', 'retention', ...
}
