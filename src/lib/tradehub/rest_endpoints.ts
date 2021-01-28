import { EndpointMap } from "./APIConnector";

export default {
  "markets/list": "/get_markets",
  "rewards/commitment_curve": "/get_commitment_curve",
  "rewards/inflation_start_time": "/get_inflation_start_time",
  "rewards/rewards_curve": "/get_reward_curve",
} as EndpointMap
