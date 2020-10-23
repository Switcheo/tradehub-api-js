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
        market: 'btc_z29',
        side: 'buy',
        quantity: '0.1',
        price: '20000',
        type: 'limit',
    })
    const createOrderLog = JSON.parse(createRes.logs[0].log)
    console.log('CREATE ORDER:', createOrderLog.status)

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

    // create orders
    console.log('')
    console.log('=== CREATING ORDERS ===')
    console.log('')
    const createsRes = await client.createOrders([
      {
        market: 'swth_eth',
        side: 'sell',
        quantity: '200',
        price: '1.01',
        type: 'limit',
      },
      {
        market: 'swth_eth',
        side: 'buy',
        quantity: '200',
        price: '8.01',
        type: 'limit',
      },
    ]
  )
  const createOrdersLog = JSON.parse(createsRes.logs[0].log)
  console.log('CREATE ORDERS:', createOrdersLog.status)

    // cancel all orders
    console.log('')
    console.log('=== CANCELLING ALL ORDERS ===')
    console.log('')
    const cancelAllRes = await client.cancelAll({
        market: 'swth_eth',
    })
    const cancelAllLog = JSON.parse(cancelAllRes.logs[0].log)
    console.log('CANCEL ALL:', cancelAllLog.status)

  // change leverage
  console.log('')
  console.log('=== CHANGE LEVERAGE ===')
  console.log('')
  const leverageRes = await client.setLeverage({
      market: 'btc_z29',
      leverage: '1.1',
  })
  const changeLeverageLog = JSON.parse(leverageRes.logs[0].log)
  console.log('CHANGE LEVERAGE:', changeLeverageLog.status)

  // edit margin
  console.log('')
  console.log('=== EDIT POSITION MARGIN ===')
  console.log('')
  const editMarginRes = await client.editMargin({
      market: 'btc_z29',
      margin: '1900',
  })
  const editMarginLog = JSON.parse(editMarginRes.logs[0].log)
  console.log('EDIT MARGIN:', editMarginLog.status)

}

trade()