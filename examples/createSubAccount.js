// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')
const net = 'LOCALHOST'

async function run() {
  const valAccount = await Wallet.connect(mnemonics[0])
  const newAccount = wallet.newAccount()
  console.log('newAccount', newAccount.pubKeyBech32)
  const tokenReq = {
    address: newAccount.pubKeyBech32,
    amount: '1000',
    denom: 'swth',
  }
  const mintResult = await api.mintTokens(tokenReq)
  console.log('mintResult', mintResult)

  const subWallet = await Wallet.connect(newAccount.mnemonic)
	const createResult = await api.createSubAccount(valAccount, {
    SubAddress: subWallet.pubKeyBech32
  })
  console.log('createResult', createResult)

  const activateResult = await api.activateSubAccount(subWallet, {
    ExpectedMainAccount: valAccount.pubKeyBech32
  })

  console.log('activateResult', activateResult)
}

run()
