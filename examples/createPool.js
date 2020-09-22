const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createPool() {
  const newAccount = wallet.newAccount()
  const mintAccount = await Wallet.connect(process.env.MNEMONICS)
  
  const tokenReq = {
    toAddress: newAccount.pubKeyBech32,
    mint: [
      {
        amount: '100000',
        denom: 'swth',
      },
      {
        amount: '100000',
        denom: 'eth',
      }
    ],
  }
  const mintResult = await api.mintMultipleTestnetTokens(mintAccount, tokenReq)
  console.log('mintResult', mintResult)
  await sleep(1000)
  const accountWallet = await Wallet.connect(newAccount.mnemonic)
  console.log('creating pool')
  const params = {
    TokenADenom: 'eth',
    TokenBDenom: 'swth',
  }
  api.createPool(accountWallet, params).then(console.log)
}

createPool()
