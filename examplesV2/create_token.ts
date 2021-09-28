import * as BIP39 from "bip39";
import { CreateTokenMsg, TradeHubSDK } from '..';
import "./_setup";

TradeHubSDK.APIClient.DEBUG_HEADERS = true;

const PARAMS: CreateTokenMsg = [{
  name: 'Zilliqa-bridged ETH',
  symbol: 'zETH',
  denom: 'eth.z.1',
  decimals: '18',
  native_decimals: '18',
  blockchain: 'zil',
  chain_id: '18',
  asset_id: '2ca315f4329654614d1e8321f9c252921192c5f2',
  is_collateral: false,
  lock_proxy_hash: 'd73c6b871b4d0e130d64581993b745fc938a5be7',
  delegated_supply: '0',
}, {
  name: 'Zilliqa-bridged USDT',
  symbol: 'zUSDT',
  denom: 'usdt.z.1',
  decimals: '6',
  native_decimals: '6',
  blockchain: 'zil',
  chain_id: '18',
  asset_id: '5266b9a7bd7772c7ff596e1a7e5b4c49872ef232',
  is_collateral: false,
  lock_proxy_hash: 'd73c6b871b4d0e130d64581993b745fc938a5be7',
  delegated_supply: '0',
}, {
  name: 'Zilliqa-bridged WBTC',
  symbol: 'zWBTC',
  denom: 'wbtc.z.1',
  decimals: '8',
  native_decimals: '8',
  blockchain: 'zil',
  chain_id: '18',
  asset_id: '75fa7d8ba6bed4a68774c758a5e43cfb6633d9d6',
  is_collateral: false,
  lock_proxy_hash: 'd73c6b871b4d0e130d64581993b745fc938a5be7',
  delegated_supply: '0',
}];


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
