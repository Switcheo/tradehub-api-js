import * as BIP39 from "bip39";
import { RPCParams, TradeHubSDK } from '../build/main';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

const PARAMS: RPCParams.CreateVaultType = {
	collateral_denom: "swth",
    debt_denom: "eth",
    collateralization_ratio: "0.01",
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

  const res = await connectedSDK.admin.createVaultType(PARAMS);
  console.log("create market response", res);
})().catch(console.error).finally(() => process.exit(0))