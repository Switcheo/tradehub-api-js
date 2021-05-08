import * as BIP39 from "bip39";
import { TradeHubSDK } from '..';

(async () => {
  const mnemonic = BIP39.generateMnemonic()
  console.log("generated mnemonic:", mnemonic)

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.MainNet,
    debugMode: true,
  })

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address)

  const account = await connectedSDK.loadAccount();
  console.log("loaded account", account);
})().catch(console.error).finally(() => process.exit(0))
