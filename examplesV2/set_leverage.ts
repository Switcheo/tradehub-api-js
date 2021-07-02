import * as BIP39 from "bip39";
import { SetLeverageMsg, TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

const PARAMS: SetLeverageMsg = {
  market: "btc_z29",
  leverage: "10"
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

  const order = await connectedSDK.leverage.set(PARAMS);
  console.log("set leverage response", order);
})().catch(console.error).finally(() => process.exit(0))