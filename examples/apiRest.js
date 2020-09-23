const { RestClient } = require('../build/main')

async function run() {
  const rest = new RestClient()
  const markets = await rest.getMarkets()
  console.log(markets)
  
}

run()
