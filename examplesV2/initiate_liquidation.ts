import * as BIP39 from "bip39";
import { RPCParams, TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

const PARAMS: RPCParams.InitiateLiquidation = {
    positions: [
        {
          market: "btc_z29",
          address: "tswth1mw90en8tcqnvdjhp64qmyhuq4qasvhy2s6st4t"
        }
    ]
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

  const order = await connectedSDK.broker.initiateLiquidation(PARAMS);
  console.log("initiate liquidation response", order);
})().catch(console.error).finally(() => process.exit(0))