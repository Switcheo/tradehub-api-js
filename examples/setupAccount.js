const { RestClient, WalletClient, Network } = require("../.")

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 *
 * @param {string} mnemonic
 * @param {Network} network
 * @returns {Promise<WalletClient>}
 */
module.exports = async function setupAccount(mnemonic, network = Network.LocalHost) {
    const wallet = await WalletClient.connectMnemonic(mnemonic, network)
    const client = new RestClient({ network, wallet })
    const fees = await client.getGasFees()
    wallet.initialize({ fees })
    if (network === Network.LocalHost) {
      const mintResult = await client.mintTokens({
          address: wallet.pubKeyBech32,
          amount: '1000',
          denom: 'swth',
      })
      console.log('mintResult:', mintResult)
      await sleep(1000)
    }
    return wallet
}
