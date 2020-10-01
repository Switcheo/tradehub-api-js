// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../build/main')
const { clients } = SDK
const { WalletClient } = clients
const mnemonics = require('../mnemonics.json')

async function createDeposit() {
  const wallet = await WalletClient.connectMnemonic(mnemonics[0], process.env.NET) // this is the receiving addr
  const params = {
    name: 'Switcheo NEP-5',
    symbol: 'SWTHNV2',
    denom: 'swth-n-v2',
    decimals: '8',
    native_decimals: '8',
    blockchain: 'neo',
    chain_id: '4',
    asset_id: 'bce14688890823e90ccd2119b23cd7a212aca08b',
    is_collateral: false,
    lock_proxy_hash: '092cec2fd8e88693dc068a30176d667711df39e3',
    delegated_supply: '0',
    originator: 'swth1lp5tsyq623gxd0q496v5u8jrvpfgu2lcks6zun',
    externalBalance: '7000000000' // 70.00000000
  }
  await wallet.sendNeoDeposit(params, process.env.PRIVATE_KEY).then(console.log) // this is the sending addr
}

createDeposit()
