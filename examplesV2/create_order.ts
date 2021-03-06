import * as BIP39 from "bip39";
import { CreateOrderMsg, TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

const PARAMS: CreateOrderMsg = {
  market: "swth_eth",
  quantity: "109360",
  type: "limit",
  side: "buy",
  is_reduce_only: false,
  is_post_only: false,
  price: "0.0000171",
};

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic()
  console.log("mnemonic:", mnemonic)

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.TestNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  const order = await connectedSDK.order.create(PARAMS);
  console.log("create order response", order);
})().catch(console.error).finally(() => process.exit(0))
