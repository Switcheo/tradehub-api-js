// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createMarket() {
  const newAccount = wallet.newAccount()
  const accountWallet = await Wallet.connect(newAccount.mnemonic)
  const mintAccount = await Wallet.connect(process.env.MNEMONICS)

  const tokenReq = {
    toAddress: newAccount.pubKeyBech32,
    mint: [{
      amount: '1000',
      denom: 'swth',
    }],
  }
  const mintResult = await api.mintMultipleTestnetTokens(mintAccount, tokenReq)
  console.log('mintResult', mintResult)
  // const mintResult = await api.mintTokens(tokenReq)


  // console.log('minted')
  await sleep(2000)
  console.log('creating market')
  const params = {
    Name: 'lib_usd',
    DisplayName: 'libra',
    MarketType: 'spot',
    Description: 'libra is the best coin',
    Base: 'btc',
    Quote: 'eth',
    LotSize: '10000000000',
    TickSize: '100000000.000000000000000000',
    MinQuantity: '20000000000',
    RiskStepSize: '0',
    InitialMarginBase: '1.000000000000000000',
    InitialMarginStep: '0.000000000000000000',
    MaintenanceMarginRatio: '0.000000000000000000',
    ImpactSize: 0,
    MarkPriceBand: '0',
    LastPriceProtectedBand: '0',
    IndexOracleID: '',
    ExpiryTime: '0',
  }
  api.addMarket(accountWallet, params).then(console.log)
}

createMarket()
