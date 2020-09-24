// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const BigNumber = require('bignumber.js')

async function createWithdrawal() {
  const mnemonic = 'direct social glue family aspect vanish hollow grocery armed goat fortune chapter'
  const accountWallet = await Wallet.connect(mnemonic, 'DEVNET')
  const params = {
    to_address: '6ee8ff54dda23d4c9feeca474794bd077ddf96d1',
    denom: 'swth2',
    amount: new BigNumber('0.00000010').toFixed(18),
    fee_amount: new BigNumber('0.00000001').toFixed(18),
    fee_address: 'swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7',
  }
  const result = await api.createWithdrawal(accountWallet, params)
  console.log('result', result)
}

createWithdrawal()
