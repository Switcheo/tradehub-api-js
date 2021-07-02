import * as BIP39 from "bip39";
import { CreateOrderMsg, EditOrderMsg, TradeHubSDK } from '..';
import "./_setup";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

const CREATE_PARAMS: CreateOrderMsg = {
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
    network: TradeHubSDK.Network.LocalHost,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  const order = await connectedSDK.order.create(CREATE_PARAMS);
  console.log("create order response", order);
  await sleep(1000)


  const EDIT_PARAMS: EditOrderMsg = {
    id: JSON.parse(order.logs[0].log).order.order_id,
    quantity: "100000",
    price: "0.0000180",
  }

  const editOrder = await connectedSDK.order.edit(EDIT_PARAMS);
  console.log("edit order response", editOrder);
})().catch(console.error).finally(() => process.exit(0))