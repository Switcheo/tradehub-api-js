// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const fetch = require('node-fetch')
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')


async function update() {
  const newAccount = wallet.newAccount()
  const accountWallet = await Wallet.connect(newAccount.mnemonic)

  const tokenReq = {
    address: newAccount.pubKeyBech32,
    amount: '1000',
    denom: 'swth',
  }
  const mintResult = await api.mintTokens(tokenReq)
  console.log('mintResult', mintResult)

  const params = {
    Username: 'alice',
    Twitter: 'bob',
  }
  const result = await api.updateProfile(accountWallet, params)
  console.log('result', result)
}

update()
