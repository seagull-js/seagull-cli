import { Collect, Origin, Transform } from 'aws-data-science'
import { Command, command, Context, metadata, param } from 'clime'
import { existsSync, writeFileSync } from 'fs'
import { groupBy } from 'lodash'
import * as moment from 'moment'
import { join } from 'path'
import * as shell from 'shelljs'
import { IPirateEvent, Journeys, toJsonFile } from '../../lib/reporting'

@command({ description: 'normalize code style and formatting' })
export default class extends Command {
  @metadata
  async execute() {
    const appName = require(join(process.cwd(), 'package.json')).name
    const name = `/aws/lambda/${appName}-dev-api-Track`
    const { startTime, endTime } = dailyBracket()
    const events = await pipeline(name, startTime, endTime)
    const journeys = new Journeys(events)
    shell.mkdir('-p', join(process.cwd(), 'reports'))
    const filePath = join(process.cwd(), 'reports', 'daily.json')
    toJsonFile(filePath, journeys)
  }
}

function dailyBracket(date?: string) {
  const toUnix = ts => parseInt(ts.format('x'), 10)
  const day = date ? moment(date, 'YYYY-MM-DD') : moment().subtract(1, 'day')
  const startTime = toUnix(day.startOf('day'))
  const endTime = toUnix(day.endOf('day'))
  return { startTime, endTime }
}

async function pipeline(name, t1, t2): Promise<IPirateEvent[]> {
  return new Origin.CloudWatchLog(name, t1, t2)
    .pipe(new Transform.ParseLambdaLog())
    .pipe(new Transform.Map<any, string>(event => event.messages[0]))
    .pipe(new Transform.Map<string, IPirateEvent>(lineToEvent))
    .pipe(new Transform.Filter(obj => !!obj))
    .pipe(new Collect.Array<IPirateEvent>())
    .promise()
}

function lineToEvent(line: string): IPirateEvent {
  try {
    const rx = /(.+)\t(.+)\t(\w+)\s(.*)/
    const [, ts, requestId, name, str] = line.match(rx)
    const obj = JSON.parse(str)
    obj.timestamp = new Date(ts).getTime()
    return obj
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log(error)
    return null
  }
}
