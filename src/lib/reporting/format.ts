import { writeFileSync } from 'fs'
import Journeys from './journeys'

export function toJsonFile(path, journeys: Journeys): void {
  const metrics = journeys.calculateMetrics()
  const pirateMetrics = {
    acquisitions: metrics.acquisitions,
    activationRate: metrics.activations / metrics.usersTotal,
    referralRate: metrics.referrals / metrics.usersTotal,
    retentionRate: metrics.retentions / metrics.usersTotal,
    revenueRate: metrics.revenues / metrics.usersTotal,
  }
  const acquisitionOrigins = {} // TODO, not tracked yet
  const pageMetrics = {} // TODO: not tracked yet
  const finalDataSet = {
    acquisitionOrigins,
    pageMetrics,
    pirateMetrics,
    userData: metrics,
  }
  // tslint:disable-next-line:no-console
  console.log(finalDataSet)
  writeFileSync(path, JSON.stringify(finalDataSet, null, 2), 'utf-8')
}
