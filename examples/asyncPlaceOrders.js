// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

async function asyncCreateOrders() {
  const wallet = await Wallet.connect(mnemonics[1])
  const sequence = (await wallet.getAccount()).result.value.sequence
  const params = {
    Market: 'swth_eth',
    Side: 'buy',
    Quantity: '100',
    Price: '0.01',
  }
  const firstSequence = sequence
  const secondSequence = (parseInt(sequence) + 1).toString()

  api.createOrder(wallet, params, { mode: 'async', sequence: firstSequence })
    .then(console.log)
  api.createOrder(wallet, params, { mode: 'async', sequence: secondSequence })
    .then(console.log)
}

asyncCreateOrders()
