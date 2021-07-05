import * as BIP39 from "bip39";
import { RPCParams, TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic();
  console.log("mnemonic:", mnemonic);

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.LocalHost,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  await connectedSDK.initialize();

  const result = await connectedSDK.governance.submitProposal<RPCParams.UpdateMarketProposal>(
    RPCParams.Proposal.Type.UpdateMarket,
    {
      title: "test",
      description: "test",
      market: {
        name: "swth_eth",
        display_name: "SWTH_ETH",
        description: "SWTH/ETH spot market",
        min_quantity: "20000000000",
        risk_step_size: "0",
        initial_margin_base: "1.000000000000000000",
        initial_margin_step: "0.000000000000000000",
        maintenance_margin_ratio: "0.000000000000000000",
        max_liquidation_order_ticket: "0",
        max_liquidation_order_duration: "0",
        impact_size: "0",
        mark_price_band: "0",
        last_price_protected_band: "0",
        taker_fee: "0.002000000000000000",
        maker_fee: "-0.001000000000000000",
        is_active: true,
        originator: connectedSDK.wallet.bech32Address,
      },
    },
  );

  console.log(result);
})().catch(console.error).finally(() => process.exit(0));
