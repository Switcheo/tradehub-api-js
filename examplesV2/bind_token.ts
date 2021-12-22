import * as BIP39 from "bip39";
import { TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;


(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic()
  console.log("mnemonic:", mnemonic)

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.MainNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  const token = await connectedSDK.wallet.sendTx({
    type: "coin/MsgBindToken",
    value: {
      "source_denom": "swth",
      "wrapped_denom": "swth.z.2",
      "originator": connectedSDK.wallet.bech32Address,
    },
  });
  console.log("create token response", token);
})().catch(console.error).finally(() => process.exit(0))
