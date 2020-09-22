// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

async function createVote() { //
  const wallet = await Wallet.connect(mnemonics[0])
  const msg = {
    OracleID: 'DXBT',
    Timestamp: '1577441290',
    Data: '60000'
  }
  api.createVote(wallet, msg).then(console.log)
}

createVote()
