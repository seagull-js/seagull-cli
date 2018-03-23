import { CloudFormation, CloudFront } from 'aws-sdk'

/**
 * Returns the physical resource Id of a deployed CloudFront by using CloudFormation Stack info
 * @param region The aws region id
 * @param StackName The stack name
 * @param LogicalResourceId The logical resource id, should be the key of the distribution in the serverless yml. Defaults to 'distribution' which is the main CloudFront distribution of seagull applications
 */
export const findMainCloudFrontResourceID = async (
  region: string,
  StackName: string,
  LogicalResourceId = 'distribution'
) => {
  const cf = new CloudFormation({ region })
  const distributionParams = { LogicalResourceId, StackName }
  const cfDescriptionRequest = cf.describeStackResource(distributionParams)
  const { StackResourceDetail } = await cfDescriptionRequest.promise()
  return StackResourceDetail.PhysicalResourceId
}

/**
 * Creates a invalidation of cloudfront cache objects
 * @param DistributionId the physical id of the cloudfront whose cache will be invalidated
 * @param paths an array of globbed paths for matching cache object which will be invalidated
 */
export const invalidateDistribution = async (
  DistributionId: string,
  paths: string[]
) => {
  const distribution = new CloudFront()
  const timeStamp = new Date().getTime().toString()
  const Paths = { Items: paths, Quantity: paths.length }
  const InvalidationBatch = { CallerReference: timeStamp, Paths }
  const invalidationOpts = { DistributionId, InvalidationBatch }
  const invalidation = distribution.createInvalidation(invalidationOpts)
  await invalidation.promise()
}
