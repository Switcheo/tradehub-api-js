// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../build/main')
const { clients } = SDK
const { WalletClient, RestClient } = clients
const mnemonics = require('../mnemonics.json')

async function createToken() {
  const wallet = await WalletClient.connectMnemonic(mnemonics[0], process.env.NET)
  const params = {
    name: 'Switcheo NEP-5',
    symbol: 'SWTHN',
    denom: 'swth-n',
    decimals: '8',
    native_decimals: '8',
    blockchain: 'neo',
    chain_id: '4',
    asset_id: 'a0bbd75a5a6d4cbefe9499eba0c8e108f3d24705',
    is_collateral: false,
    lock_proxy_hash: '206a5dfd13955c4d66a012d748bba4bbee79b7bb',
    delegated_supply: '0',
  }
  const rest = new RestClient({ network: process.env.NET, wallet })
  rest.createToken(params).then(console.log)
}

createToken()
