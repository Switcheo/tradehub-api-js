const fetch = require('node-fetch')
const { RestClient, Network, newAccount, WalletClient } = require("../.")
const setupAccount = require("./setupAccount")
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const network = 'LOCALHOST'

// addLiquidity add liquidity to the 50/50 eth_dai pool based on the current eth to usd spot price.
async function run() {
  const wallet = await setupAccount(process.env.MNEMONICS)
  const minterClient = new RestClient({ wallet, network })
  const account = newAccount(network)

  
  const tokenReq = {
    toAddress: account.pubKeyBech32,
    mint: [
      {
        amount: '100000000',
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
  .then(async (res) => {
      const spotPrice = res.result.price * 10
      console.log('adding liquidity')
      const addParams = {
        pool_id: '1',
        amount_a: '1946345.0666215',
        amount_b: '100',
      }
      const addResponse = await mainClient.addLiquidity(addParams)
      console.log('addResponse')
      console.log(addResponse)

      console.log('staking')
      const stakeParams = {
          denom: 'swth50-eth50-1',
          amount: '0.1',
        //   duration: '36000', // 10 hours
          duration: '100', // 10 seconds
      }
      const stakeResponse = await mainClient.stakePoolToken(stakeParams)
      console.log('stakeResponse')
      console.log(stakeResponse)

      
    //   console.log('')
    //   console.log('unstaking')
    //   const unstakeParams = {
    //     denom: 'swth50-eth50-1',
    //     amount: '0.1',
    //   }
    //   const unstakeResponse = await mainClient.unstakePoolToken(unstakeParams)
    //   console.log('unstakeResponse')
    //   console.log(unstakeResponse)

      await sleep(20 * 1000)
      console.log('')
      console.log('claiming')
      const claimParams = {
        pool_id: '1',
      }
      const claimResponse = await mainClient.claimPoolRewards(claimParams)
      console.log('claimResponse')
      console.log(claimResponse)
      process.exit()
    })

}

run()
