import { NETWORK } from '@lib/config'
import { Network } from '@lib/types'
import { GetAccountOpts, GetAccountResponse } from './api'
import { CheckUserNameOpts } from './api/check_username'
import { GetLeverageOpts, GetLeverageResponse } from './api/get_leverage'
import { GetOrderOpts } from './api/get_order'
import { GetPositionOpts, GetPositionResponse, GetPositionsOpts } from './api/get_position'
import { GetProfileOpts, GetProfileResponse } from './api/get_profile'
import { ListValidatorDelegationsOpts, ListValidatorDelegationsResponse } from './api/list_validator_delegations'
import APIManager from './APIConnector'
import TradehubEndpoints from './rest_endpoints'

export interface APIClientOpts {
  debugMode?: boolean
}

class APIClient {
  public readonly apiManager: APIManager<typeof TradehubEndpoints>
  public readonly debugMode: boolean

  constructor(
    public readonly network: Network,
    opts?: APIClientOpts,
  ) {
    const restUrl = NETWORK[network].REST_URL
    this.apiManager = new APIManager(restUrl, TradehubEndpoints)

    this.debugMode = opts?.debugMode ?? false
  }

  async getAccount(opts: GetAccountOpts): Promise<GetAccountResponse> {
    const queryParams = { account: opts.address }
    const routeParams = {}
    const request = this.apiManager.path('account/detail', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetAccountResponse
  }

  async getValidatorDelegations(opts: ListValidatorDelegationsOpts): Promise<ListValidatorDelegationsResponse> {
    const routeParams = { validator: opts.validator }
    const request = this.apiManager.path('validators/delegations', routeParams)
    const response = await request.get()
    return response.data as ListValidatorDelegationsResponse
  }

  async checkUsername(opts: CheckUserNameOpts): Promise<Boolean> {
    const queryParams = { account: opts.username }
    const routeParams = {}
    const request = this.apiManager.path('account/username_check', routeParams, queryParams)
    const response = await request.get()
    return response.data as Boolean
  }

  async getProfile(opts: GetProfileOpts): Promise<GetProfileResponse> {
    const queryParams = { address: opts.address }
    const routeParams = {}
    const request = this.apiManager.path('account/get_profile', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetProfileResponse
  }

  async getPosition(opts: GetPositionOpts): Promise<GetPositionResponse> {
    const queryParams = { account: opts.account, market: opts.market }
    const routeParams = {}
    const request = this.apiManager.path('account/get_position', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetPositionResponse
  }

  async getPositions(opts: GetPositionsOpts): Promise<GetPositionResponse[]> {
    const queryParams = { account: opts.account }
    const routeParams = {}
    const request = this.apiManager.path('account/get_positions', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetPositionResponse[]
  }

  async getLeverage(opts: GetLeverageOpts): Promise<GetLeverageResponse[]> {
    const queryParams = { account: opts.account }
    const routeParams = {}
    const request = this.apiManager.path('account/get_leverage', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetLeverageResponse[]
  }

  async getOrder(opts: GetOrderOpts): Promise<GetLeverageResponse[]> {
    const queryParams = { order_id: opts.order_id }
    const routeParams = {}
    const request = this.apiManager.path('account/get_leverage', routeParams, queryParams)
    const response = await request.get()
    return response.data as GetLeverageResponse[]
  }
}

export default APIClient
