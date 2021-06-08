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
    amount: new BigNumber(100).toString(10),
    denom: "swth-e",
    to_address: "F284ecc0eFAB1D9c3eD06D04F3A1256393F8e704".toLowerCase(),
    fee_address: "swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7",
    fee_amount: "1",
    originator: connectedSDK.wallet.bech32Address,
  })
  console.log("create withdraw response", token);
})().catch(console.error).finally(() => process.exit(0))
