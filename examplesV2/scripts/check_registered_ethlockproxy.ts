const { ABIs } = require("../../build/main/lib/eth");
const { ethers } = require('ethers');
const { ETHClient } = require('../../build/main/lib/tradehub/clients');
const { Blockchain } = require('../../build/main/lib/tradehub/utils/blockchain');
const { Network, NetworkConfigs } = require('../../build/main/lib/tradehub/utils/network');

(async () => {
const network = Network.DevNet
const ethClient = ETHClient.instance({
  blockchain: Blockchain.Ethereum,
  configProvider: {
    getConfig: () => NetworkConfigs[network],
  },
})
const lockProxyContract = new ethers.Contract(
  ethClient.getLockProxyAddress(),
  ABIs.lockProxy,
  ethClient.getProvider()
)
const tokenAddress = '0x2bD9aAa2953F988153c8629926D22A6a5F69b14E'
const isRegistered = await lockProxyContract.registry(tokenAddress)
console.log(isRegistered )
})().catch(console.error).finally(() => process.exit(0))