// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const { RestClient } = require("../.")
const setupAccount = require("./setupAccount")
require('dotenv').config()

const network = 'LOCALHOST'
async function set() {
  const wallet = await setupAccount(process.env.MNEMONICS)
  const client = new RestClient({ wallet, network })

  console.log('setting rewards')
  const params = {
      weights: [
          {
            pool_id: '1',
            weight: '1',
          },
          {
            pool_id: '2',
            weight: '4',
          },
          {
            pool_id: '3',
            weight: '1',
          },
          {
            pool_id: '4',
            weight: '2',
          },
          {
            pool_id: '5',
            weight: '2',
          },
          {
            pool_id: '6',
            weight: '0',
          },
          {
            pool_id: '7',
            weight: '0',
          },
          {
            pool_id: '8',
            weight: '0',
          },
      ],
  }
  const res = await client.setRewardsWeights(params)
  console.log('set', res)
  process.exit()
}

set()
