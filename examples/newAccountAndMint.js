// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const newAccount = wallet.newAccount()

async function newAccountAndMint() {
  const wallet = await Wallet.connect(newAccount.mnemonic)
  console.log(newAccount)
  console.log(wallet.pubKeyBech32)

  const tokenReq = {
    address: wallet.pubKeyBech32,
    amount: '1000',
    denom: 'swth',
  }
  api.mintTokens(tokenReq).then(console.log).catch(console.log)
}

newAccountAndMint()
