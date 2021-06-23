import * as BIP39 from "bip39";
import { RPCParams, TradeHubSDK } from '../build/main';
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

  const result = await connectedSDK.governance.submitProposal<RPCParams.SetRewardCurveProposal>(
    RPCParams.Proposal.Type.SetRewardCurve,
    {
      title: "test",
      description: "test",
      msg: {
        start_time: "2022-01-01T00:00:00Z",
        initial_reward_bps: 3000,
        reduction_multiplier_bps: 150,
        reduction_interval_seconds: "604800",
        reductions: 26,
        final_reward_bps: 0,
        originator: connectedSDK.wallet.bech32Address,
      },
    },
  );

  console.log(result);
})().catch(console.error).finally(() => process.exit(0));
