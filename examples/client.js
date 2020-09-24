const { BaseRestApi, BaseWsApi } = require('../.')

// console.log('BaseRestApi', BaseRestApi)
// const c = new BaseRestApi()
const w = new BaseWsApi()
console.log('w', w)
w.subscribeMarketStats()
