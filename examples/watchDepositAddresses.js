// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../build/main')
const { clients } = SDK
const { WalletClient } = clients

// const net = 'LOCALHOST'
const net = 'DEVNET'

async function run() {
  const mnemonic = 'rely final pipe disease fetch make noodle patch sting hand man digital'
  const account = await WalletClient.connectMnemonic(mnemonic, net)
  const address = await account.getDepositAddress('eth')
  // account.sendNeoDeposits('AK5JtqW3NbdmuxNDjHPo7KuShjjXKz6u6U')
  console.log('swth address', account.pubKeyBech32)
  console.log('address', address)
  account.watchEthDepositAddress()
}

run()
