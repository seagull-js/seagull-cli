import * as packageJson from 'package-json'

export async function getLatestVersion(name: string): Promise<object> {
  const result = await packageJson(name)
  return result
}
