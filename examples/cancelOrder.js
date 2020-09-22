// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

async function cancelOrder() {
  const wallet = await Wallet.connect(mnemonics[1])
  const params = {
    id: '6BCE28C18C37357486113A3939913EC70069637D717E71EF4ED7FC3594DDCA4F'
  }
  api.cancelOrder(wallet, params).then(console.log)
}

cancelOrder()
