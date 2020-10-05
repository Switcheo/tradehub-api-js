// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../build/main')
const { clients } = SDK
const { WalletClient, RestClient } = clients
require('dotenv').config()

async function asyncCreateOrders() {
  const wallet = await WalletClient.connectMnemonic(process.env.MNEMONICS)
  const rest = new RestClient({ network: process.env.NET, wallet })
  const sequence = (await wallet.getAccount()).result.value.sequence
  const params = {
    market: 'swth_eth',
    side: 'buy',
    quantity: '100',
    price: '0.01',
  }
  const firstSequence = sequence
  const secondSequence = (parseInt(sequence) + 1).toString()

  rest.createOrder(params, { mode: 'async', sequence: firstSequence })
    .then(console.log)
    rest.createOrder(params, { mode: 'async', sequence: secondSequence })
    .then(console.log)
}

asyncCreateOrders()
