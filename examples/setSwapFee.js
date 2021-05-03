const { RestClient } = require("../build/main")
const setupAccount = require("./setupAccount")
require('dotenv').config()

const network = 'MAINNET'

async function changeSwapFee() {
  const wallet = await setupAccount(process.env.MNEMONICS, network)
  const client = new RestClient({ wallet, network })

  console.log('updating pool swap fee')
  const params = {
    pool_id: '21',
    swap_fee: '0.001',
  }
  const res = await client.changeSwapFee(params)
  console.log({ res })
  process.exit()
}

changeSwapFee()
