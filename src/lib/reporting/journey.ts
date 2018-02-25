import { find } from 'lodash'
import { IPirateEvent } from './interfaces'

export default class Journey {
  isAcquisition: boolean = false
  isActivation: boolean = false
  isRetention: boolean = false
  isReferral: boolean = false
  isRevenue: boolean = false
  private uuid: string

  constructor(private eventList: IPirateEvent[]) {
    this.uuid = eventList[0].uuid
    this.isAcquisition = !!find(eventList, e => e.name === 'acquisition')
    this.isActivation = !!find(eventList, e => e.name === 'activation')
    this.isRetention = !!find(eventList, e => e.name === 'retention')
    this.isReferral = !!find(eventList, e => e.name === 'referral')
    this.isRevenue = !!find(eventList, e => e.name === 'revenue')

    // can not be set at the same time - doesn't make sense
    if (this.isAcquisition) {
      this.isRetention = false
    }
  }
}
