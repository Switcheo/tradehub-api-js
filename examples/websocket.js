const { WSConnector } = require("..")
const { WSChannel } = require("../build/main/lib/websocket/types");

(async () => {
  const wsConnector = new WSConnector({
    endpoint: 'ws://localhost:5000/ws',
    debugMode: true,
  });

  // run connect before executing any request/subscription
  await wsConnector.connect();

  // request for data
  const result = await wsConnector.request("get_recent_trades", {
    market: "swth_eth1",
  });

  console.log(result)

  // subscribe to new channel
  await wsConnector.subscribe({ channel: WSChannel.market_stats }, (result) => {
    console.log("received market stats", result);
  });

  // unsubscribe
  await wsConnector.unsubscribe({ channel: WSChannel.market_stats });

  // clean up
  await wsConnector.disconnect();
})().catch(console.error);
