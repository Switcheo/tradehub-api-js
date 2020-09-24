import * as types from '../types'
import { WalletClient, SignMessageOptions }  from '../clients/wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions { }

export interface SubmitProposalMsg {
  content: {
    type: string,
    value: {
      title: string,
      description: string,
      changes: ReadonlyArray<{
        subspace: string,
        key: string,
        value: string,
      }>,
    },
  },
  initial_deposit?: ReadonlyArray<{
    denom: string,
    amount: string,
  }>,
  proposer?: string,
}

export interface DepositProposalMsg {
  proposal_id: string,
  depositor?: string,
  amount: ReadonlyArray<{
    denom: string,
    amount: string,
  }>,
}

export interface VoteProposalMsg {
  proposal_id: string,
  voter?: string,
  option: string,
}

export async function submitProposal(wallet: WalletClient, msg: SubmitProposalMsg, options?: Options) {
  if (!msg.proposer) msg.proposer = wallet.pubKeyBech32
  return wallet.signAndBroadcast([msg], [types.SUBMIT_PROPOSAL_TYPE], options)
}

export async function depositProposal(wallet: WalletClient, msg: DepositProposalMsg, options?: Options) {
  if (!msg.depositor) msg.depositor = wallet.pubKeyBech32
  return wallet.signAndBroadcast([msg], [types.DEPOSIT_PROPOSAL_TYPE], options)
}

export async function voteProposal(wallet: WalletClient, msg: VoteProposalMsg, options?: Options) {
  if (!msg.voter) msg.voter = wallet.pubKeyBech32
  return wallet.signAndBroadcast([msg], [types.VOTE_PROPOSAL_TYPE], options)
}
