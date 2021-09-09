import { TradeHubSDK } from '..'
import "./_setup";

(async () => {
  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.MainNet,
    debugMode: true,
  })

  const result = await sdk.api.getWeeklyPoolRewards();
  console.log(result)

})().catch(console.error).finally(() => process.exit(0))
