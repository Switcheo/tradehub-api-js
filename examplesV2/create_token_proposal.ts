import * as BIP39 from "bip39";
import { TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic();
  console.log("mnemonic:", mnemonic);

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.TestNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  await connectedSDK.initialize();

  const result = await connectedSDK.governance.submitProposal<TradeHubSDK.RPCParams.TokenProposal>("coin/TokenProposal", [],
    connectedSDK.wallet.bech32Address, {
    title: "test",
    description: "test",
    token: {
      name: "Wrapped BNB",
      symbol: "WBNB",
      denom: "wbnb1",
      decimals: 18 as any,
      native_decimals: "18",
      blockchain: "bsc",
      chain_id: "6",
      asset_id: "0x47837fC56f88F6A44Ed35c5e3F7981f6127dDe03",
      is_collateral: false,
      lock_proxy_hash: "0x47837fC56f88F6A44Ed35c5e3F7981f6127dDe03",
      delegated_supply: "0",
      originator: connectedSDK.wallet.bech32Address,
    },
  });

  console.log(result);
})().catch(console.error).finally(() => process.exit(0));
