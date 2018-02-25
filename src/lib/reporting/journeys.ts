import { groupBy, values } from 'lodash'
import { IPirateEvent } from './interfaces'
import Journey from './journey'

export interface IMetrics {
  acquisitions: number // share of users coming the first time
  activations: number // share of users doing at least one click
  retentions: number // share of users coming for a second (or more) time
  referrals: number // share of users doing a share action somehow
  revenues: number // share of users completing a revenue transaction event
  revenueTotal: number
  usersTotal: number
}

export default class Journeys {
  private list: Journey[]

  constructor(eventList: IPirateEvent[]) {
    const groups = values(groupBy(eventList, 'uuid'))
    this.list = groups.map(events => new Journey(events))
  }

  calculateMetrics(): IMetrics {
    return {
      acquisitions: this.list.filter(j => j.isAcquisition).length,
      activations: this.list.filter(j => j.isActivation).length,
      referrals: this.list.filter(j => j.isReferral).length,
      retentions: this.list.filter(j => j.isRetention).length,
      revenueTotal: 0, // TODO
      revenues: this.list.filter(j => j.isRevenue).length,
      usersTotal: this.list.length,
    }
  }
}
