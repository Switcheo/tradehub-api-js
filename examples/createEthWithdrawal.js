const BigNumber = require('bignumber.js')
const { Network, Blockchain, WalletClient, RestClient } = require('../build/main')
const mnemonics = require('../mnemonics.json');

const network = Network.DevNet
const TOKEN_DENOM = 'swth-b5';

// withdraw will be from swth address derived from the mnemonics

const DEST_ADDRESS = '0x00f3050735fe26bfF8E961Fd6F451A511fD10e15';

(async () => {
  const wallet = await WalletClient.connectMnemonic(mnemonics[0], network) // this is the receiving addr
  const rest = new RestClient({ network, wallet })
  const result = await rest.createWithdrawal({
    to_address: DEST_ADDRESS,
    denom: TOKEN_DENOM,
    amount: new BigNumber('100').toFixed(18),
    fee_amount: new BigNumber('10').toFixed(18),
    fee_address: 'swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7',
  }, Blockchain.BinanceSmartChain)

  console.log(result)
})().catch(console.error)
