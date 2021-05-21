// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const { RestClient } = require("../.")
const setupAccount = require("./setupAccount")
require('dotenv').config()

const network = 'LOCALHOST'

async function set() {
  const wallet = await setupAccount(process.env.MNEMONICS, network)
  const client = new RestClient({ wallet, network })

  console.log('minting tokens')
  const params = {
    address: 'tswth1aulqmelxjxjkue92gt24exlnyhwrtt4sywq9ep',
    amount: '1000000',
    denom: 'eth',
  }
  const res = await client.mintTokens(params)
  console.log('minted:', res)
  process.exit()
}

set()
