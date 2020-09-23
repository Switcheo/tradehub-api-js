import fetch from '../utils/fetch'

import { camelCaseDeep } from "../utils/json";
import { getNetwork } from '../config';

export default class BaseRestApi {
  protected baseUrl: string

  constructor(network: string) {
    this.baseUrl = getNetwork(network).REST_URL
  }

  protected async fetchJson(relativeUrl: string): Promise<any> {
    const url: string = `${this.baseUrl}${relativeUrl}`
    const res = await fetch(url)
    const json = await res.json()
    return camelCaseDeep(json)
  }

  public async getMarkets() {
    return this.fetchJson('/get_markets')
}
}
