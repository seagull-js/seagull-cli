// proxy to console.log, suppress all logging when in testing mode
export function log(msg: string, ...args) {
  if (process.env.NODE_ENV !== 'test') {
    // tslint:disable-next-line:no-console
    console.log(msg, ...args)
  }
}
