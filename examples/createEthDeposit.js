// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const { default: BigNumber } = require('bignumber.js')
const { ethers } = require('ethers')
const { ETHClient, Network, Blockchain } = require('../build/main')
const SDK = require('../build/main')
const { NETWORK } = require('../build/main/lib/config')
const { clients } = SDK
const { WalletClient } = clients
const mnemonics = require('../mnemonics.json');

(async () => {
  const wallet = await WalletClient.connectMnemonic(mnemonics[0], Network.DevNet) // this is the receiving addr
  const token = {
    "name": "Switcheo 4 (BEP-20)",
    "symbol": "SWTHB4",
    "denom": "swth-b4",
    "decimals": 8,
    "blockchain": "bsc",
    "chain_id": 79,
    "asset_id": "7e0691323f7ad0be576f2ee98378271e84a15811",
    "is_active": true,
    "is_collateral": false,
    "lock_proxy_hash": "12f466db69b85ee7aa17a66a8b75f8c6d6f04815",
    "delegated_supply": "0",
    "originator": "swth1xjad4uft0uk4d35nlk3gzp3v5gw5x2n40fmage",

    // deposit amount update here
    external_balance: new BigNumber(100).shiftedBy(8).toString(),
  }
  const ethClient = ETHClient.instance({
    network: Network.DevNet,
    blockchain: Blockchain.BinanceSmartChain,
  })


  const privateKey = wallet.hdWallet[Blockchain.Ethereum] // private key should be same
  const ethWallet = new ethers.Wallet(`0x${privateKey}`)
  const ethAddress = ethWallet.address
  const swthAddress = wallet.pubKeyBech32
  const result = await ethClient.sendDeposit(token, swthAddress, ethAddress, async (message) => {
    console.log('start sign')
    const messageBytes = ethers.utils.arrayify(message)
    const signatureBytes = await ethWallet.signMessage(messageBytes)
    const signature = ethers.utils.hexlify(signatureBytes).replace(/^0x/g, '')
    console.log("sign", message, signature)
    return {
      address: ethAddress,
      signature,
    }
  })
  if (result === 'insufficient balance')
    throw new Error(result)
  
  console.log('result', `${result.status} ${result.statusText}`)

  try {
    error = await result.text();
    console.log('response', error)
  } catch (error) {

  } finally {
    process.exit(0)
  }
})().catch(console.error)
