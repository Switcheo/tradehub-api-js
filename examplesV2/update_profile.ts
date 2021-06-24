import * as BIP39 from "bip39";
import { TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic()
  console.log("mnemonic:", mnemonic)

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.TestNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  const order = await connectedSDK.account.updateProfile("myUsername", "SwitcheoNetwork");
  console.log("update profile response", order);
})().catch(console.error).finally(() => process.exit(0))
