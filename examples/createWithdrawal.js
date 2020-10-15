// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../build/main')
const { clients } = SDK
const { WalletClient, RestClient } = clients
const BigNumber = require('bignumber.js')
const { ethers } = require('ethers')

const net = 'DEVNET'

async function createWithdrawal(blockchain) {
  // const mnemonic = 'direct social glue family aspect vanish hollow grocery armed goat fortune chapter'
  const mnemonic = 'rely final pipe disease fetch make noodle patch sting hand man digital'
  const account = await WalletClient.connectMnemonic(mnemonic, net)
  const rest = new RestClient({ network: net, wallet: account })
  let msg = {}


  if (blockchain == 'neo') {
    msg = {
      to_address: 'ARtK6YPiSXs9RzkcUNKXQskczs2rSyQfrz',
      denom: 'swth2',
      amount: new BigNumber('0.001').toFixed(18),
      fee_amount: new BigNumber('0.0001').toFixed(18),
      fee_address: 'swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7',
    }
  }

  if (blockchain == 'eth') {
    msg = {
      to_address: '0x571037cc2748c340e3c6d9c7af589c6d65806618',
      denom: 'jrc1',
      amount: new BigNumber('100').toFixed(18),
      fee_amount: new BigNumber('10').toFixed(18),
      fee_address: 'swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7',
    }
  }

  const result = await rest.createWithdrawal(msg, blockchain)
  console.log('result', result)
}

createWithdrawal('eth')
