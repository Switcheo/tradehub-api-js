const fetch = require('node-fetch')
const { RestClient, Network, newAccount, WalletClient } = require("../.")
const setupAccount = require("./setupAccount")
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const network = 'LOCALHOST'

// addLiquidity add liquidity to the 50/50 eth_dai pool based on the current eth to usd spot price.
async function addLiquidity() {
  const wallet = await setupAccount(process.env.MNEMONICS)
  const minterClient = new RestClient({ wallet, network })
  const account = newAccount(network)

  
  const tokenReq = {
    toAddress: account.pubKeyBech32,
    mint: [
      {
        amount: '10000',
        denom: 'swth',
      },
      {
        amount: '10000',
        denom: 'eth',
      },
      {
        amount: '1000000',
        denom: 'dai',
      }
    ],
  }
  const mintResult = await minterClient.mintMultipleTestnetTokens(tokenReq)
  console.log('mintResult', mintResult)
  await sleep(1000)

  const accountWallet = await WalletClient.connectMnemonic(account.mnemonic, network)
  const mainClient = new RestClient({ wallet: accountWallet, network})

  // get eth spot price
  const url = 'https://api.cryptowat.ch/markets/coinbase-pro/ethusd/price'
  fetch(url).then(res => res.json())
  .then(res => {
      const spotPrice = res.result.price * 10
      console.log('adding liquidity')
      const addParams = {
        pool_id: '2',
        amount_a: '10',
        amount_b: spotPrice.toString(),
      }
      mainClient.addLiquidity(addParams).then(console.log)
    })

}

addLiquidity()
