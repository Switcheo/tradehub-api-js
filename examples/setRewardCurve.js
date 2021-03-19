// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const { RestClient } = require("../.")
const setupAccount = require("./setupAccount")
require('dotenv').config()

const network = 'LOCALHOST'
async function set() {
  const wallet = await setupAccount(process.env.MNEMONICS)
  const client = new RestClient({ wallet, network })

  console.log('setting reward curve')
  const params = {
    start_time: '2021-03-11T03:50:00Z',
    initial_reward_bps: 3000,
    reduction_multiplier_bps: 150,
    reduction_interval_seconds: '604800',
    reductions: 26,
    final_reward_bps: 0,
}
  const res = await client.setRewardCurve(params)
  console.log('set', res)
  process.exit()
}

set()
