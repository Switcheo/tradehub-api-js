// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet

async function delegateTokens() {
  const newAccount = wallet.newAccount()
  const tokenReq = {
    address: newAccount.pubKeyBech32,
    amount: '1000', // this will be adjusted for decimals i.e. multiplied by 10^8
    denom: 'swth',
  }
  await api.mintTokens(tokenReq)
  console.log("newAccount.pubKeyBech32", newAccount.pubKeyBech32, newAccount.privateKey)

  const accountWallet = await Wallet.connect(newAccount.mnemonic)
  const validators = (await accountWallet.getValidators()).result

  const params = {
    delegator_address: accountWallet.pubKeyBech32,
    validator_address: validators[0].operator_address,
    amount: {
      amount: '100000000000',
      denom: 'swth',
    },
  }
  console.log("params", params)
  const result = await api.delegateTokens(accountWallet, params)
  console.log('result', result)
}

delegateTokens()
