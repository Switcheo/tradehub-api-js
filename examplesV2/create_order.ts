import * as BIP39 from "bip39";
import { CreateOrderMsg, TradeHubSDK } from '..';

const PARAMS: CreateOrderMsg = {
  market: "swth_eth1",
  quantity: "109360",
  type: "limit",
  side: "buy",
  is_reduce_only: false,
  is_post_only: false,
  price: "0.0000171",
};

(async () => {
  const mnemonic = BIP39.generateMnemonic()
  console.log("generated mnemonic:", mnemonic)

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.MainNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  const order = await connectedSDK.order.create(PARAMS);
  console.log("create order response", order);
})().catch(console.error).finally(() => process.exit(0))
