const { RestClient, WalletClient, newAccount } = require('../build/main')

async function run() {
  const wallet = await new WalletClient.connectPrivateKey(newAccount().privateKey, 'LOCALHOST')
  const rest = new RestClient('LOCALHOST', wallet)
  const account = await rest.getAccount({ address: wallet.pubKeyBech32 })
  console.log(account)
  
}

run()
