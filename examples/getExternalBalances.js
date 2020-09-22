// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const net = 'LOCALHOST'
// const net = 'DEVNET'

async function getAccount() {
  const newAccount = wallet.newAccount()
  console.log('newAccount address', newAccount.pubKeyBech32)
  console.log('newAccount mnemonic', newAccount.mnemonic)
  const account = await Wallet.connect(newAccount.mnemonic, net)
  const { address } = await account.getDepositAddress('eth')
  console.log('eth deposit address', address)
  const balances = await account.getExternalBalances(address, 'eth')
  console.log('balances', balances)
}

getAccount()
