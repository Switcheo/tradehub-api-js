// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const { WalletClient, Network } = require('..')
require("dotenv").config()

const net = Network.MainNet
// const net = 'DEVNET'

async function getAccount() {
  const mnemonics = process.env.MNEMONICS;
  const wallet = await WalletClient.connectMnemonic(mnemonics, net)
  wallet.getAccount().then(console.log)
}

getAccount()
