import { TradeHubSDK } from '..'

(async () => {
  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.MainNet,
    debugMode: true,
  })

  const validatorAddress = 'swthvaloper1re38akp4r4lx4aw3mnrergfz62cayp9pdvd0uq'
  const delegationsResponse = await sdk.api.getValidatorDelegations({ validator: validatorAddress })

  console.log(delegationsResponse.result)
})().catch(console.error).finally(() => process.exit(0))
