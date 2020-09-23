import fetch from '../utils/fetch'

import { camelCaseDeep } from "../utils/json"
import { getNetwork } from '../config'
import { WalletClient } from './wallet'

export class RestClient {
  protected baseUrl: string
  private wallet: WalletClient

  constructor(network: string, wallet: WalletClient) {
    this.baseUrl = getNetwork(network).REST_URL
    this.wallet = wallet
  }

  protected async fetchJson(relativeUrl: string): Promise<any> {
    const url: string = `${this.baseUrl}${relativeUrl}`
    const res = await fetch(url)
    const json = await res.json()
    return camelCaseDeep(json)
  }

  public async getAccount(address?: string) {
    if (!address && !this.wallet) {
      throw new Error('get_account: missing address param')
    }
    if (!address) {
      address = this.wallet.pubKeyBech32
    }
    return this.fetchJson(`/get_account?account=${address}`)
  }

  public async getMarkets() {
    return this.fetchJson('/get_markets')
}
}
