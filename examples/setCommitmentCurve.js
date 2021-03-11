// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const { RestClient } = require("../.")
const setupAccount = require("./setupAccount")
require('dotenv').config()

const network = 'LOCALHOST'
async function set() {
  const wallet = await setupAccount(process.env.MNEMONICS)
  const client = new RestClient({ wallet, network })

  console.log('setting commitment curve')
  const params = {
    max_duration: '15552000',
    max_reward_multiplier: 200,
}
  const res = await client.setCommitmentCurve(params)
  console.log('set', res)
  process.exit()
}

set()
