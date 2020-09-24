import * as types from '../types'
import { WalletClient, SignMessageOptions }  from '../clients/wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions { }

export interface CreateOracleMsg {
	id: string,
	description: string,
	min_turnout_percentage: string,
	max_result_age: string,
	security_type: string,
	result_strategy: string,
	resolution: string,
	spec: string,
	originator?: string,
}

export interface CreateVoteMsg {
	oracle_id: string,
	timestamp: string,
	data: string,
	originator?: string,
}

export async function createOracle(wallet: WalletClient, msg: CreateOracleMsg, options?: Options) {
	if (!msg.originator) msg.originator = wallet.pubKeyBech32

	return wallet.signAndBroadcast([msg], [types.CREATE_ORACLE_TYPE], options)
}

export async function createVote(wallet: WalletClient, msg: CreateVoteMsg, options?: Options) {
	if (!msg.originator) msg.originator = wallet.pubKeyBech32

	return wallet.signAndBroadcast([msg], [types.CREATE_VOTE_TYPE], options)
}
