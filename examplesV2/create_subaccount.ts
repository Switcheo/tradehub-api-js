import * as BIP39 from "bip39";
import { RPCParams, TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

const CREATE_PARAMS: RPCParams.CreateSubAccount = {
  sub_address: "tswth1m9h80cfhqn08x7hull0n7pwhlu9k0vp7n92p6y"
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

  const createSubaccount = await connectedSDK.subaccount.create(CREATE_PARAMS);
  console.log("create subaccount response", createSubaccount);
})().catch(console.error).finally(() => process.exit(0))