// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet

async function createOrder() {
  const newAccount = wallet.newAccount()
  console.log('newAccount', newAccount.pubKeyBech32)
  const tokenReq = {
    address: newAccount.pubKeyBech32,
    amount: '1000',
    denom: 'swth',
  }
  const mintResult = await api.mintTokens(tokenReq)
  console.log('mintResult', mintResult)

  const accountWallet = await Wallet.connect(newAccount.mnemonic)
  const params = {
    Market: 'swth_eth',
    Side: 'sell',
    Quantity: '200',
    Price: '1.01',
  }
  const orderResult = await api.createOrder(accountWallet, params)
  console.log('orderResult', orderResult)
}

createOrder()
