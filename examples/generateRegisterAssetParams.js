const BigNumber = require('bignumber.js');
const { ethers } = require('ethers');
const { Network, Blockchain, WalletClient, RestClient, ETHClient } = require('../build/main')
const { ABIs } = require('../build/main/lib/eth')
const mnemonics = require('../mnemonics.json');

const network = Network.DevNet
const TOKEN_DENOM = 'swth-b2';
const tokenContract = '0x9415257c7caa743c838a62bbb60d35dd844c1941'
  ;
/**
 * _argBz => varbytes(assetHash, nativeAssetHash)
 * assetHash => TradeHub token denom
 * nativeAssetHash => external chain token contract address
 * 
 * _fromContractAddr => targetProxyHash
 * 
 * _chainId => counterpartChainId on lock proxy contract
 */

(async () => {
  const wallet = await WalletClient.connectMnemonic(mnemonics[0], network) // this is the receiving addr
  const rest = new RestClient({ network, wallet })
  const ethClient = ETHClient.instance({
    network,
    blockchain: Blockchain.BinanceSmartChain,
  })

  const token = await rest.getToken({ token: TOKEN_DENOM })

  const tokenProxyHash = `0x${ethClient.getTargetProxyHash(token)}`

  const lockProxyContract = new ethers.Contract(ethClient.getLockProxyAddress(), ABIs.lockProxy, ethClient.getProvider())
  const chainId = (await lockProxyContract.counterpartChainId()).toString()

  const assetHash = ethers.utils.toUtf8Bytes(TOKEN_DENOM)
  const nativeAssetHash = ethers.utils.arrayify(tokenContract)

  const registerAssetArgs = ethers.utils.hexConcat([assetHash, nativeAssetHash])

  console.log("_argBz", registerAssetArgs)
  console.log("_fromContractAddr", tokenProxyHash)
  console.log("_fromChainId", chainId)
})().catch(console.error).finally(() => process.exit(0))
