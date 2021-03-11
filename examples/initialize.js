const { Network, WalletClient, RestClient } = require('../build/main')
const mnemonics = require('../mnemonics.json')

const network = Network.DevNet;

(async () => {
  const wallet = await WalletClient.connectMnemonic(mnemonics[0], network)
  const rest = await new RestClient({ network, wallet })

  const fees = await rest.getGasFees()

  wallet.initialize({ fees })

  // do stuff

  console.log(await wallet.getFeeInfo("swth"))

})().catch(console.error).finally(() => process.exit(0))
