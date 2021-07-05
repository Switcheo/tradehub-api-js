import * as BIP39 from "bip39";
import { RPCParams, TradeHubSDK } from '../build/main';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

const PARAMS: RPCParams.CreateMarket = {
    name: 'lib_usd',
    display_name: 'libra',
    market_type: 'spot',
    description: 'libra is the best coin',
    base: 'btc',
    quote: 'eth',
    lot_size: '10000000000',
    tick_size: '100000000.000000000000000000',
    min_quantity: '20000000000',
    maker_fee: "0.002",
    taker_fee: "0.002",
    risk_step_size: '0',
    initial_margin_base: '1.000000000000000000',
    initial_margin_step: '0.000000000000000000',
    maintenance_margin_ratio: '0.000000000000000000',
    max_liquidation_order_ticket: "0",
    max_liquidation_order_duration: "0",
    impact_size: "0",
    mark_price_band: '0',
    last_price_protected_band: '0',
    index_oracle_id: '',
    expiry_time: '0',
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

  const res = await connectedSDK.admin.createMarket(PARAMS);
  console.log("create market response", res);
})().catch(console.error).finally(() => process.exit(0))