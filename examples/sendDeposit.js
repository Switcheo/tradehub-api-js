// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const net = 'LOCALHOST'
// const net = 'DEVNET'

async function run() {
  const mnemonic = 'weird album height core exercise loop must swear sort muscle mirror camp'
  const account = await Wallet.connect(mnemonic, net)
  const result = await account.sendDeposit(
    'eth',
    '0x0000000000000000000000000000000000000000',
    'reth5',
    '10000000000000000'
  )
  console.log('sent deposit', result)
}

run()
