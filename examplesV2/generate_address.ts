import * as BIP39 from "bip39";
import { SWTHAddress, TradeHubSDK } from '..';
import "./_setup";

(async () => {
  const mnemonic = BIP39.generateMnemonic();
  const address = SWTHAddress.generateAddress(mnemonic, 0, {
    network: TradeHubSDK.Network.MainNet,
    type: "main",
  });

  console.log("generated mnemonic:", mnemonic)
  console.log("address:", address);
})().catch(console.error).finally(() => process.exit(0))
