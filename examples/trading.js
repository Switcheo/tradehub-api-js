const { RestClient, Network, WalletClient } = require("../build/main")
require('dotenv').config()

// random mnemonic
const mnemonic = 'weapon salute receive close learn hope bone alter action reveal balance depend ketchup rose spread loyal unknown globe curtain foster term else van thumb'
const network = Network.LocalHost

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

async function trade() {
    const minterWallet = await WalletClient.connectMnemonic(process.env.MNEMONICS, network)
    const minterClient = new RestClient({ wallet: minterWallet, network })
    const wallet = await WalletClient.connectMnemonic(mnemonic, network)
    const client = new RestClient({ wallet, network })
    
    // mints token so we can perform trading functions
    const tokenReq = {
      toAddress: wallet.pubKeyBech32,
      mint: [
        {
          amount: '100000',
          denom: 'swth',
        },
        {
          amount: '100000',
          denom: 'eth',
        },
        {
          amount: '100000',
          denom: 'iusd',
        }
      ],
    }
    const mintResult = await minterClient.mintMultipleTestnetTokens(tokenReq)
    // console.log('mintResult', mintResult)

    // create order
    console.log('')
    console.log('=== CREATING ORDER ===')
    console.log('')
    const createRes = await client.createOrder({
        market: 'swth_eth',
        side: 'sell',
        quantity: '200',
        price: '1.01',
        type: 'limit',
    })
    const createOrderLog = JSON.parse(createRes.logs[0].log)
    console.log('CREATE ORDER:', createOrderLog.status)

    // await sleep(3000)

    // edit order
    console.log('')
    console.log('=== EDITING ORDER ===')
    console.log('')
    const editRes = await client.editOrder({
        id: createOrderLog.order.order_id,
        quantity: '200',
        price: '1.02',
    })
    const editOrderLog = JSON.parse(editRes.logs[0].log)
    console.log('EDIT ORDER:', editOrderLog.status)

    // cancel order
    console.log('')
    console.log('=== CANCELLING ORDER ===')
    console.log('')
    const cancelRes = await client.cancelOrder({
        id: createOrderLog.order.order_id,
    })
    const cancelOrderLog = JSON.parse(cancelRes.logs[0].log)
    console.log('CANCEL ORDER:', cancelOrderLog.status)

}

trade()