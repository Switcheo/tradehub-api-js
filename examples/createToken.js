// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

async function createToken() {
  const wallet = await Wallet.connect(mnemonics[0])
  const params = {
    Name: 'jiarong coin',
    Symbol: 'LAYWC',
    Denom: 'laywc',
    Decimals: '10',
    Blockchain: 'eos',
    ChainID: '1',
    AssetID: 'laywc',
    USDValue: '0.01',
    IsCollateral: false,
  }
  api.createToken(wallet, params).then(console.log)
}

createToken()
