// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const { RestClient, Network, newAccount, WalletClient } = require("../.")
const setupAccount = require("./setupAccount")
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const network = 'LOCALHOST'
async function set() {
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


  console.log('setting reward curve')
  const params = {
    start_time: '2020-12-12T07:28:30Z',
    initial_reward_bps: 6000,
    reduction_multiplier_bps: 500,
    reduction_interval_seconds: 53,
    reductions: 53,
    final_reward_bps: 400,
    originator: accountWallet.pubKeyBech32,
}
  const res = await mainClient.setRewardCurve(params)
  console.log('set', res)
  process.exit()
}

set()
