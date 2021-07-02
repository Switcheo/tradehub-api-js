import * as BIP39 from "bip39";
import { CancelAllMsg, CreateOrderMsg, TradeHubSDK } from '..';
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


  const CANCEL_ALL_PARAMS: CancelAllMsg = {
    market: "swth_eth"
  }

  const cancelAllOrder = await connectedSDK.order.cancelAll(CANCEL_ALL_PARAMS);
  console.log("cancle all orders response", cancelAllOrder);
})().catch(console.error).finally(() => process.exit(0))