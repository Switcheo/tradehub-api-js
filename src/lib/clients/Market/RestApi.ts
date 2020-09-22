import BaseRestApi from '../BaseRestApi'

export default class RestApi extends BaseRestApi {
    public async getMarkets() {
        return this.fetchJson('/get_markets')
    }
}
