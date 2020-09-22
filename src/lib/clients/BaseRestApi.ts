import fetch from '../utils/fetch'

import { camelCaseDeep } from "../utils/json";

export default class BaseRestApi {
  protected baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  protected async fetchJson(relativeUrl: string): Promise<any> {
    const url: string = `${this.baseUrl}${relativeUrl}`
    const res = await fetch(url)
    const json = await res.json()
    return camelCaseDeep(json)
  }
}
