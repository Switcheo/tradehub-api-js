const { NEOClient, Network } = require('../build/main')

const network = Network.MainNet
const ASSET_ID = 'ab38352559b8b203bde5fddfa0b07d8b2525e132'

(async () => {
  const neoClient = NEOClient.instance({
    network,
  })

  const result = await neoClient.retrieveNEP5Info(ASSET_ID)

  console.log(result)
})().catch(console.error)
