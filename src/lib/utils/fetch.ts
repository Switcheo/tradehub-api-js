import http from 'http'
import https from 'https'
import nodeFetch, {RequestInfo, RequestInit, Response} from 'node-fetch'

const httpAgent = new http.Agent({
  keepAlive: true,
})
const httpsAgent = new https.Agent({
  keepAlive: true,
})

const options = {
  agent(_parsedURL) {
    if (_parsedURL.protocol == 'http:') {
      return httpAgent
    } else {
      return httpsAgent
    }
  },
}

export default function fetch(
  url: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  return nodeFetch(url, {...options, ...init})
}
