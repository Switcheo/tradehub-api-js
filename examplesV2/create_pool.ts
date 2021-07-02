import * as BIP39 from "bip39";
import { RPCParams, TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

const PARAMS: RPCParams.CreatePool = {
    token_a_denom: 'eth',
    token_a_weight: '0.9',
    token_b_denom: 'btc',
    token_b_weight: '0.1',
    swap_fee: '0.03',
    num_quotes: '10',
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

  const res = await connectedSDK.liquiditypool.create(PARAMS);
  console.log("create pool response", res);
})().catch(console.error).finally(() => process.exit(0))