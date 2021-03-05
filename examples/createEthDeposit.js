const BigNumber = require('bignumber.js')
const { ethers } = require('ethers')
const { ETHClient, Network, Blockchain, WalletClient, RestClient } = require('../build/main')
const mnemonics = require('../mnemonics.json');

const network = Network.DevNet
const TOKEN_DENOM = 'swth-b4';

(async () => {
  const wallet = await WalletClient.connectMnemonic(mnemonics[0], network) // this is the receiving addr
  const token = await new RestClient({ network, wallet }).getToken({ token: TOKEN_DENOM })

  // deposit amount update here
  token.external_balance = new BigNumber(100).shiftedBy(8).toString()

  const ethClient = ETHClient.instance({
    network,
    blockchain: Blockchain.BinanceSmartChain,
  })

  const privateKey = wallet.hdWallet[Blockchain.Ethereum] // private key should be same
  const ethWallet = new ethers.Wallet(`0x${privateKey}`)
  const ethAddress = ethWallet.address
  const swthAddress = wallet.pubKeyBech32

  const depositAddress = await ethClient.getDepositContractAddress(swthAddress, ethAddress)
  const feeAmount = await ethClient.getDepositFeeAmount(token, depositAddress)
  console.log('*NOTE* min deposit amount', feeAmount.mul(ethers.BigNumber.from(2)).toString())

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
