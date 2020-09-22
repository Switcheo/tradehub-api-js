// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const bech32 = require('bech32')
const secp256k1 = require('secp256k1')
const bip39 = require('bip39')
const SDK = require('../.')
const { wallet, api, utils } = SDK
const { Wallet } = wallet
const { Address, PrivKeySecp256k1 } = utils

const ripemd160 = require('ripemd160')
const { sha256 } = require('sha.js')
const mnemonics = require('../mnemonics.json')

function bufferToBase64(data) {
  const buff = Buffer.from(data);
  return buff.toString('base64');
}

function concatTypedArrays(a, b) { // a, b TypedArray of same type
    var c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}

function getConsensusPublicKey(privateKey) {
  const pubKey = secp256k1.publicKeyCreate(
    Buffer.from(privateKey, 'hex'),
    true
  )

  const prefix = new Uint8Array(5)
  prefix[0] = 235
  prefix[1] = 90
  prefix[2] = 233
  prefix[3] = 135
  prefix[4] = 33

  const pubKeyBytes = concatTypedArrays(prefix, new Uint8Array(pubKey))
  const converted = bech32.toWords(pubKeyBytes)
  const consPubKey = bech32.encode('swthvalconspub', converted)
  return consPubKey
}

// NOTE: This does not work, the consPubKey is not correct
async function createValidator() {
  const newAccount = wallet.newAccount()
  const tokenReq = {
    address: newAccount.pubKeyBech32,
    amount: '1000', // this will be adjusted for decimals i.e. multiplied by 10^8
    denom: 'swth',
  }
  await api.mintTokens(tokenReq)
  console.log("newAccount.pubKeyBech32", newAccount.pubKeyBech32, newAccount.privateKey)
  const accountWallet = await Wallet.connect(newAccount.mnemonic)
  const consPubKey = getConsensusPublicKey(newAccount.privateKey)
  console.log("consPubKey", consPubKey)

  const params = {
    description: {
      moniker: 'newvalidator',
      identity: 'newid',
      website: 'www.newvalidator.com',
      details: 'An example new validator',
    },
    commission: {
      rate: '0.1',
      max_rate: '0.2',
      max_rate_change: '0.01',
    },
    min_self_delegation: '100000000000',
    delegator_address: accountWallet.pubKeyBech32,
    validator_address: accountWallet.validatorBech32,
    pubkey: consPubKey,
    value: {
      amount: '100000000000',
      denom: 'swth',
    },
  }
  console.log("params", params)
  const result = await api.createValidator(accountWallet, params)
  console.log('result', result)
}

createValidator()
