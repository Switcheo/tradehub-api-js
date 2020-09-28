const { RestClient, Network } = require("../.")
const setupAccount = require("./setupAccount")

const mnemonic = 'weapon salute receive close learn hope bone alter action reveal balance depend ketchup rose spread loyal unknown globe curtain foster term else van thumb'
const mnemonic2 = 'dog abstract wear live much jewel slender better swift retreat sell giggle topic ostrich green skate face more loyal menu coyote eternal sand shy'
const network = Network.LocalHost

async function editOrder() {
    let wallet = await setupAccount(mnemonic)
    const client = new RestClient({ wallet, network })
    // const createRes = await client.createOrder({
    //     market: 'swth_eth',
    //     side: 'sell',
    //     quantity: '200',
    //     price: '1.01',
    //     type: 'limit',
    //     is_post_only: false,
    //     is_reduce_only: false,
    // })
    // const order = JSON.parse(createRes.logs[0].log)
    // console.log(order)
    const res = await client.editOrder({
        id: '2F2406D17402D1F5D0B857FF8FE05598A9613A01BB20A17454A6BFD3E420ED53',
        quantity: '200',
        price: '1.01',
        stop_price: '1.01',
    })
    console.log('res', res)
}

editOrder()
