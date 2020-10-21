const fetch = require('node-fetch')
const { RestClient, Network, newAccount, WalletClient, LINK_POOL_PROPOSAL_TYPE } = require("../build/main")
const setupAccount = require("./setupAccount")
require('dotenv').config()

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const network = 'LOCALHOST'

async function submit() {
  const wallet = await setupAccount(process.env.MNEMONICS)
  const minterClient = new RestClient({ wallet, network })
  const account = newAccount(network)

  
  const tokenReq = {
    toAddress: account.pubKeyBech32,
    mint: [
      {
        amount: '10000',
        denom: 'swth',
      },
      {
        amount: '10000',
        denom: 'eth',
      },
      {
        amount: '1000000',
        denom: 'dai',
      }
    ],
  }
  const mintResult = await minterClient.mintMultipleTestnetTokens(tokenReq)
  console.log('mintResult', mintResult)
  await sleep(1000)

  const accountWallet = await WalletClient.connectMnemonic(account.mnemonic, network)
  const mainClient = new RestClient({ wallet: accountWallet, network})


  // export interface SubmitProposalMsg<ProposalValue> {
  //   content: {
  //     type: string,
  //     value: ProposalValue,
  //   },
  //   initial_deposit?: ReadonlyArray<{
  //     denom: string,
  //     amount: string,
  //   }>,
  //   proposer?: string,
  // }

  console.log('submitting proposal')
  const proposalMsg = {
    content: {
      type: LINK_POOL_PROPOSAL_TYPE,
      value: {
        title: 'my title',
        description: 'what a description',
        link_pool: {
          pool_id: '3',
          market: 'eth_btc',
          originator: accountWallet.pubKeyBech32,
        },
      },
    },
    initial_deposit: [{
      amount: '100000000',
      denom: 'swth',
    }],
  }
  mainClient.submitProposal(proposalMsg).then(console.log)


}

console.log(LINK_POOL_PROPOSAL_TYPE)
submit()
