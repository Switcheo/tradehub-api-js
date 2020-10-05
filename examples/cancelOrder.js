// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../build/main')
const { clients } = SDK
const { WalletClient, RestClient } = clients

async function cancelOrder() {
  const wallet = await WalletClient.connectMnemonic(process.env.MNEMONICS)
  const rest = new RestClient({ network: process.env.NET, wallet })
  const params = {
    id: '6BCE28C18C37357486113A3939913EC70069637D717E71EF4ED7FC3594DDCA4F'
  }
  rest.cancelOrder(params).then(console.log)
}

cancelOrder()
