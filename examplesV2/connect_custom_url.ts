import * as BIP39 from "bip39";
import { TradeHubSDK } from '..';
import "./_setup";

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic();
  console.log("mnemonic:", mnemonic);

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.TestNet,
    debugMode: true,
    config: {
      RestURL: "https://tradescan.switcheo.org",
    },
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  await connectedSDK.initialize();

  const account = await connectedSDK.wallet.init();
  console.log("loaded account", account);
})().catch(console.error).finally(() => process.exit(0));
