// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet

async function createOracle() {
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
  const msg = {
    ID: 'BTC_USD_xD',
    Description: 'Calculated based on an average of price feeds from Binance and Coinbase, ... more info ...',
    MinTurnoutPercentage: '67',
    MaxResultAge: '100',
    SecurityType: 'SecuredByValidators',
    ResultStrategy: 'median',
    Resolution: '10',
    Spec: '{}',
    Originator: wallet.pubKeyBech32
  }
	api.createOracle(accountWallet, msg).then(console.log)
}

createOracle()
