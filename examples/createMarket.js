const { rest } = require('lodash');
// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../build/main')
const { clients } = SDK
const { WalletClient, RestClient } = clients
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createMarket() {
  const newAccount = WalletClient.newAccount()
  const accountWallet = await WalletClient.connectMnemonic(newAccount.mnemonic)
  const mintAccount = await WalletClient.connect(process.env.MNEMONICS)
  const restClient = new RestClient({ network: process.env.NET, wallet: accountWallet })
  const minterClient = new RestClient({ network: process.env.NET, wallet: mintAccount })

  const tokenReq = {
    toAddress: newAccount.pubKeyBech32,
    mint: [{
      amount: '1000',
      denom: 'swth',
    }],
  }
  const mintResult = await minterClient.mintMultipleTestnetTokens(tokenReq)
  console.log('mintResult', mintResult)

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
