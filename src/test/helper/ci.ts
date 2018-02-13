const CI = process.env.TRAVIS === 'true'

export function skipCI(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value
  if (!originalMethod) {
    return undefined
  }
  descriptor.value = (...args) => {
    if (CI) {
      this.mocha.skip()
    }
    return originalMethod.bind(target)(...args)
  }
}
