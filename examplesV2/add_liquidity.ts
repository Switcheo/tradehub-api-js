import * as BIP39 from "bip39";
import { RPCParams, TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

const PARAMS: RPCParams.AddLiquidity = {
    pool_id: "1",
    amount_a: "1946345.0666215",
    amount_b: "100",
    min_shares: "10"
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

  const res = await connectedSDK.lp.addLiquidity(PARAMS);
  console.log("add liquidity response", res);
})().catch(console.error).finally(() => process.exit(0))
