import * as BIP39 from "bip39";
import { RPCParams, TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic();
  console.log("mnemonic:", mnemonic);

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.LocalHost,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  await connectedSDK.initialize();

  const result = await connectedSDK.governance.submitProposal<RPCParams.SetPoolRewardWeightsProposal>(
    RPCParams.Proposal.Type.SetPoolRewardWeights, 
    {
      title: "test",
      description: "test",
      msg: {
        weights: [{
          pool_id: "1",
          weight: "1",
        }],
        originator: connectedSDK.wallet.bech32Address,
      },
    },
  );

  console.log(result);
})().catch(console.error).finally(() => process.exit(0));
