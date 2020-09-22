// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../build/main')
const { wallet, api } = SDK
const { Wallet } = wallet
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function addLiquidity() {
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
  // const mintResult = await api.mintTokens(tokenReq)
  
  
  // console.log('minted')
  await sleep(1000)
  const accountWallet = await Wallet.connect(newAccount.mnemonic)

  // console.log('creating pool')
  // const params = {
  //   TokenADenom: 'eth',
  //   TokenBDenom: 'swth',
  // }
  // const create = await api.createPool(accountWallet, params)
  // console.log('create', create)

  console.log('linking pool')
  const linkParams = {
    PoolID: 'b33659f8-0cbd-445d-98eb-266f3e83b325',
    Market: 'swth_eth',
    Strategy: 'uniswap',
  }
  const link = await api.linkPool(accountWallet, linkParams)
  console.log('link', link)

  console.log('adding liquidity')
  const addParams = {
    PoolID: 'b33659f8-0cbd-445d-98eb-266f3e83b325',
    BDenom: 'eth',
    BAmount: '10000',
    ADenom: 'swth',
    AAmount: '1',
  }
  const add = await api.addLiquidity(accountWallet, addParams)
  console.log('add', add)

  // await sleep(2000)

  // console.log('removing liquidity')
  // const removeParams = {
  //   PoolID: 'b33659f8-0cbd-445d-98eb-266f3e83b325',
  //   Shares: '0.019999999999999988',
  // }
  // api.removeLiquidity(accountWallet, removeParams).then(console.log)
}

addLiquidity()
