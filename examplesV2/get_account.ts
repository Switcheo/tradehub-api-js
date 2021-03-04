import { Network, TradeHubSDK } from '..'

(async () => {
  const sdk = new TradeHubSDK({
    network: Network.MainNet,
    debugMode: true,
  })

  const address = 'swth1xkahzn8ymps6xdu6feulutawu42fkyqz5fgvhx'
  const accountResult = await sdk.api.getAccount({ address })

  console.log(accountResult.result.value)
})().catch(console.error).finally(() => process.exit(0))
