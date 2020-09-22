// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet

const net = 'DEVNET'
// const net = 'LOCALHOST'

async function mintTokens(mnemonic) {
  const account = await Wallet.connect(mnemonic, net)
  const request = {
    address: account.pubKeyBech32,
    amount: '1000',
    denom: 'swth',
  }
  const result = await api.mintTokens(request, net)
  console.log('mintTokens result', result)
}

async function createLockProxy(account) {
  const msg = {
    Creator: account.pubKeyBech32,
  }
  const result = await account.signAndBroadcast([msg], ['lockproxy/MsgCreateLockProxy'])
  console.log('createLockProxy result', result)
}

function hexToBytes(hex) {
  const bytes = []
    for (let c = 0; c < hex.length; c += 2) {
      bytes.push(parseInt(hex.substr(c, 2), 16))
    }
    return bytes
}

async function bindProxyHash(account) {
  const proxyHash = hexToBytes('b9e291f596a6f475b0bc5c369e5b0c4a494d0909')
  console.log('proxyHash', proxyHash)
  const msg = {
  	Operator: account.pubKeyBech32,
  	ToChainId: '2',
  	ToChainProxyHash: proxyHash,
  }
  const result = await account.signAndBroadcast([msg], ['lockproxy/MsgBindProxyHash'])
  console.log('bindProxyHash result', result)
}

async function run() {
  try {
    const mnemonic = 'response churn photo equip flavor feel bridge smart deal shine page witness'
    // await mintTokens(mnemonic)
    const account = await Wallet.connect(mnemonic, net)
    // await createLockProxy(account)
    await bindProxyHash(account)
  } catch (e) {
    console.log('An error occurred', e)
  }
}

run()
