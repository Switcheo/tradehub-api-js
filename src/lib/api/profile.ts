import * as types from '../types'
import { WalletClient, SignMessageOptions }  from '../clients/wallet'
import { TransactionOptions } from '../containers/Transaction'
import { getNetwork } from '../config'

interface Options extends SignMessageOptions, TransactionOptions { }

export interface UpdateProfileMsg {
  username: string,
  twitter: string,
  originator?: string,
}


export async function updateProfile(wallet: WalletClient, msg: UpdateProfileMsg, options?: Options) {
  if (!msg.originator) msg.originator = wallet.pubKeyBech32
  console.log('msg', msg)
  return wallet.signAndBroadcast([msg], [types.UPDATE_PROFILE_MSG_TYPE], options)
}

export function getProfile(net: string, address: string) {
  const network = getNetwork(net)
  return fetch(`${network.REST_URL}/get_profile?account=${address}`)
    .then(res => res.json()) // expecting a json response
}

export function getUsernameIsTaken(net: string, username: string) {
  const network = getNetwork(net)
  return fetch(`${network.REST_URL}/username_check?username=${username}`)
    .then(res => res.json()) // expecting a json response
}
