const { RestClient, Network, newAccount, WalletClient } = require("../.")
const setupAccount = require("./setupAccount")
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const network = 'LOCALHOST'

async function createPool() {
  const wallet = await setupAccount(process.env.MNEMONICS)
  const minterClient = new RestClient({ wallet, network })
  const account = newAccount(network)

  // const mintAccount = await Wallet.connect(process.env.MNEMONICS)
  
  const tokenReq = {
    toAddress: account.pubKeyBech32,
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
  const mintResult = await minterClient.mintMultipleTestnetTokens(tokenReq)
  console.log('mintResult', mintResult)
  await sleep(1000)
  const accountWallet = await WalletClient.connectMnemonic(account.mnemonic, network)
  const mainClient = new RestClient({ wallet: accountWallet, network})
  console.log('creating pool')
  const params = {
    token_a_denom: 'eth',
    token_a_weight: '0.9',
    token_b_denom: 'btc',
    token_b_weight: '0.1',
    swap_fee: '0.03',
    num_quotes: '10',
  }
  mainClient.createPool(params).then(console.log)
}

createPool()
