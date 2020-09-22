// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet

function handleResponse(label, response) {
  console.log(label, response)
}

async function testSequenceCounter() {
  const newAccount = wallet.newAccount()
  const tokenReq = {
    address: newAccount.pubKeyBech32,
    amount: '10000',
    denom: 'swth',
  }
  await api.mintTokens(tokenReq)

  console.log(newAccount.pubKeyBech32)
  const accountWallet = await Wallet.connect(newAccount.mnemonic, 'LOCALHOST')
  const params = {
    Market: 'swth_eth',
    Side: 'sell',
    Quantity: '200',
    Price: '1.01',
  }
  api.createOrder(accountWallet, params).then((response) => handleResponse('response1', response))
  api.createOrder(accountWallet, params).then((response) => handleResponse('response2', response))
  api.createOrder(accountWallet, params).then((response) => handleResponse('response3', response))

  await new Promise(resolve => setTimeout(resolve, 500))

  const oracleParams = {
    Name: 'BTC_USD_xD',
    Description: 'Calculated based on an average of price feeds from Binance and Coinbase, ... more info ...',
    MinConsensusThreshold: '67',
    MaxResultAge: '100',
    SecurityType: 'SecuredByValidators',
    ResultStrategy: 'median',
    Config: JSON.stringify({
      "median_threshold": '10'
    }),
    Resolution: '10',
    Spec: '{}',
  }

  api.createOracle(accountWallet, oracleParams).then((response) => handleResponse('response4', response))
  api.createOracle(accountWallet, oracleParams).then((response) => handleResponse('response5', response))

  await new Promise(resolve => setTimeout(resolve, 1000))

  api.createOrder(accountWallet, params).then((response) => handleResponse('response6', response))
  api.createOrder(accountWallet, params).then((response) => handleResponse('response7', response))

  await new Promise(resolve => setTimeout(resolve, 200))

  api.createOrder(accountWallet, params).then((response) => handleResponse('response8', response))
  api.createOrder(accountWallet, params).then((response) => handleResponse('response9', response))
}

testSequenceCounter()
