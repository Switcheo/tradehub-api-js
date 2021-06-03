import * as BIP39 from "bip39";
import { CreateTokenMsg, TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

const PARAMS: CreateTokenMsg = {
  name: 'Zilliqa USD',
  symbol: 'zUSD',
  denom: 'zusd',
  decimals: '12',
  native_decimals: '12',
  blockchain: 'zil',
  chain_id: '110',
  asset_id: 'ced1f00d5088ef3d246fc622e9b0e5173f2216bf',
  is_collateral: false,
  lock_proxy_hash: '90cc3b304addf373cd6e78dbf64c36139fa55aab',
  delegated_supply: '0',
};

(async () => {
  const mnemonic = process.env.MNEMONICS ?? BIP39.generateMnemonic()
  console.log("mnemonic:", mnemonic)

  const sdk = new TradeHubSDK({
    network: TradeHubSDK.Network.DevNet,
    debugMode: true,
  });

  const connectedSDK = await sdk.connectWithMnemonic(mnemonic);
  console.log("connected wallet:", connectedSDK.wallet.bech32Address);

  const token = await connectedSDK.admin.createToken({
    ...PARAMS,
    originator: connectedSDK.wallet.bech32Address,
  })
  console.log("create token response", token);
})().catch(console.error).finally(() => process.exit(0))
