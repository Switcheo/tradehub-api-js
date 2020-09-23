import RestApi from "./RestApi"
import WsApi from "./WsApi"

export default class ClientApi {
    public rest: RestApi
    public ws: WsApi

    constructor(restBaseUrl: string, socket: WebSocket) {
        this.rest = new RestApi(restBaseUrl)
        this.ws = new WsApi(socket)
    }
}
