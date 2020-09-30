// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
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
    asset_id: '5a77cd0a7703678135d437efe2db97b2f4a0b731',
    is_collateral: false,
    lock_proxy_hash: '8296b8652895228ea0d124d457804720301aff6a',
    delegated_supply: '0',
  }
  const rest = new RestClient({ network: process.env.NET, wallet })
  rest.createToken(params).then(console.log)
}

createToken()
