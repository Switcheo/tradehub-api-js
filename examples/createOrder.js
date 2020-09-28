const { RestClient, Network } = require("../.")
const setupAccount = require("./setupAccount")

// random mnemonic
const mnemonic = 'weapon salute receive close learn hope bone alter action reveal balance depend ketchup rose spread loyal unknown globe curtain foster term else van thumb'
const network = Network.LocalHost

async function createOrder() {
    const wallet = await setupAccount(mnemonic)
    const client = new RestClient({ wallet, network })
    const res = await client.createOrder({
        market: 'swth_eth',
        side: 'sell',
        quantity: '200',
        price: '1.01',
        type: 'limit',
        is_post_only: false,
        is_reduce_only: false,
    })
    console.log('res:', res)
}
createOrder()