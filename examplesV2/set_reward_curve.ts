import * as BIP39 from "bip39";
import { RPCParams, TradeHubSDK } from '../build/main';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

const PARAMS: RPCParams.SetRewardCurve = {
	start_time: "2022-03-11T03:50:00Z",
    initial_reward_bps: 1000,
    reduction_multiplier_bps: 100,
    reduction_interval_seconds: '604800',
    reductions: 10,
    final_reward_bps: 500
};

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic()
  console.log("mnemonic:", mnemonic)

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.LocalHost,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  const res = await connectedSDK.admin.setRewardCurve(PARAMS);
  console.log("create market response", res);
})().catch(console.error).finally(() => process.exit(0))