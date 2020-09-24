// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const BigNumber = require('bignumber.js')

async function createWithdrawal() {
  const mnemonic = 'direct social glue family aspect vanish hollow grocery armed goat fortune chapter'
  const accountWallet = await Wallet.connect(mnemonic)
  const params = {
    to_address: '6bae56C7C534c38E08564C4b482a04Ea53B7A29c',
    denom: 'neo',
    amount: new BigNumber('10').toFixed(18),
    fee_amount: new BigNumber('1').toFixed(18),
    fee_address: 'swth142ph88p9ju9wrmw65z6edq67f20p957m92ck9d',
  }
  const result = await api.createWithdrawal(accountWallet, params)
  console.log('result', result)
}

createWithdrawal()
