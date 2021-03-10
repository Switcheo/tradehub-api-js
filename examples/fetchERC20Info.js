const { ETHClient, Network, Blockchain } = require('../build/main')

const network = Network.MainNet
const blockchain = Blockchain.Ethereum
const CONTRACT_HASH = ''

(async () => {
  const ethClient = ETHClient.instance({
    network,
    blockchain,
  })

  const result = await ethClient.retrieveERC20Info(CONTRACT_HASH);
  console.log(result);
})().catch(console.error)
