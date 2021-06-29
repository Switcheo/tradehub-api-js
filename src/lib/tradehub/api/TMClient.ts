import { BlockEventAttr, BlockEvents } from '../models/rest';
import { SimpleMap } from '../utils';
import APIManager, { RequestError, RequestResult, ResponseParser } from './APIConnector';
import { GetBlockEventsOpts, TradehubEndpoints } from './spec';

export interface TmClientOpts {
  debugMode?: boolean
}

class TmClient {
  public readonly apiManager: APIManager<typeof TradehubEndpoints>
  public readonly debugMode: boolean

  public static DEBUG_HEADERS: boolean = false

  constructor(
    tmUrl: string,
    opts?: TmClientOpts,
  ) {
    const responseParser: ResponseParser = this.parseResponse.bind(this);
    this.apiManager = new APIManager(tmUrl, TradehubEndpoints, responseParser)

    this.debugMode = opts?.debugMode ?? false
  }

  async parseResponse(response: Response): Promise<RequestResult> {
    const { status, statusText, headers, url } = response
    const result: RequestResult = { status, statusText, headers, url }

    if (this.debugMode) {
      console.log("parsing response", url);
      console.log("status", `[${status}] ${statusText}`);
    }

    if (TmClient.DEBUG_HEADERS) {
      console.log("printing headers", response.headers);
    }

    try {
      const responseJson = await response.json()
      result.data = responseJson

      if (this.debugMode) {
        console.log("response json", JSON.stringify(result.data));
      }

    } catch (e) {
      if (this.debugMode) {
        console.error("could not parse response as json");
        console.error(e);
      }
    }

    if (response.status >= 400 && response.status < 600) {
      throw new RequestError(result, result.data?.error || 'unknown error')
    }

    return result;
  }

  // Generic

  async getBlockEvents(opts: GetBlockEventsOpts): Promise<BlockEvents> {
    const request = this.apiManager.path('tendermint/block_results', {}, opts)
    const response = await request.get()
    const data = response.data

    const parseEvents = (evts: ReadonlyArray<any>) => {
      return evts.map((e) => ({
        type: e.type as string,
        attributes: e.attributes.reduce((result, attr: BlockEventAttr) => {
          if (typeof window?.atob === "function") {
            result[window.atob(attr.key)] = attr.value === null || typeof attr.value === 'undefined' ? null : window.atob(attr.value)        
          } else {
            const key = Buffer.from(attr.key, "base64").toString("utf8")
            result[key] = attr.value === null || typeof attr.value === 'undefined' ? null : Buffer.from(attr.value, "base64").toString("utf8")
          }
          return result;
        }, {} as SimpleMap),
      }))
    }

    const events = {
      begin_block_events: parseEvents(data.result?.begin_block_events ?? []),
      end_block_events: parseEvents(data.result?.end_block_events ?? []),
    }

    return events as BlockEvents
  }
}

export default TmClient
