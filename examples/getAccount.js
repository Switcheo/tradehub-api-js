// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const net = 'LOCALHOST'
// const net = 'DEVNET'

async function getAccount() {
  const wallet = await Wallet.connect(mnemonics[1], net)
  wallet.getAccount().then(console.log)
}

getAccount()
