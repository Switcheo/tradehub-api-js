import BigNumber from "bignumber.js";
import * as BIP39 from "bip39";
import { TradeHubSDK } from '..';
import "./_setup";

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic()
  console.log("mnemonic:", mnemonic)

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.DevNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  const token = await connectedSDK.coin.withdraw({
    amount: new BigNumber(1).toString(10),
    denom: "zusd",
    to_address: "<zil address>",
    fee_address: "swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7",
    fee_amount: "0",
    originator: connectedSDK.wallet.bech32Address,
  })
  console.log("create token response", token);
})().catch(console.error).finally(() => process.exit(0))
