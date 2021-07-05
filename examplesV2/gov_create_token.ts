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

  const result = await connectedSDK.governance.submitProposal<RPCParams.CreateTokenProposal>(
    RPCParams.Proposal.Type.CreateToken,
    {
      title: "test",
      description: "test",
      token: {
        name: "Binance USD (BEP-20)",
        symbol: "BUSD",
        denom: "busd1",
        decimals: "18",
        native_decimals: "18",
        blockchain: "bsc",
        chain_id: "6",
        asset_id: "e9e7cea3dedca5984780bafc599bd69add087d56",
        is_collateral: false,
        lock_proxy_hash: "b5d4f343412dc8efb6ff599d790074d0f1e8d430",
        delegated_supply: "0",
        originator: connectedSDK.wallet.bech32Address,
      },
    },
  );

  console.log(result);
})().catch(console.error).finally(() => process.exit(0));
