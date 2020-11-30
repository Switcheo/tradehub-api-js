// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../build/main')
const { clients } = SDK
const { WalletClient } = clients
const mnemonics = require('../mnemonics.json')

async function createDeposit() {
  const wallet = await WalletClient.connectMnemonic(mnemonics[0], process.env.NET) // this is the receiving addr
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
    originator: 'swth1phsut994s4e9apdc25vdln02g9rz7exz2fr92n',
    external_balance: '8800000000' // 88.00000000
  }
  await wallet.sendNeoDeposit(params, process.env.PRIVATE_KEY).then(console.log) // this is the sending addr
}

createDeposit()
