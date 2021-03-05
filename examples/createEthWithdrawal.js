const BigNumber = require('bignumber.js')
const { ethers } = require('ethers')
const { ETHClient, Network, Blockchain, WalletClient, RestClient } = require('../build/main')
const mnemonics = require('../mnemonics.json');

const network = Network.DevNet
const TOKEN_DENOM = 'swth-b5';

(async () => {
  const wallet = await WalletClient.connectMnemonic(mnemonics[0], network) // this is the receiving addr
  const rest = new RestClient({ network, wallet })
  const token = await rest.getToken({ token: TOKEN_DENOM })
  const result = await rest.createWithdrawal({
    to_address: '0x00f3050735fe26bfF8E961Fd6F451A511fD10e15',
    denom: TOKEN_DENOM,
    amount: new BigNumber('100').toFixed(18),
    fee_amount: new BigNumber('10').toFixed(18),
    fee_address: 'swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7',
  }, Blockchain.BinanceSmartChain)

  console.log(result)
})().catch(console.error)
