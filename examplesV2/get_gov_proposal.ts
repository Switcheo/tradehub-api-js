import { TradeHubSDK } from '..'
import "./_setup";

(async () => {
  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.MainNet,
    debugMode: true,
  })

  const proposalResponse = await sdk.api.getGovProposal({ proposalId: 99 })

  console.log(proposalResponse.result)
})().catch(console.error).finally(() => process.exit(0))
