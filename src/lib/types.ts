// Orders
export const CREATE_ORDER_MSG_TYPE = 'order/MsgCreateOrder'
export const CANCEL_ORDER_MSG_TYPE = 'order/MsgCancelOrder'
export const CANCEL_ALL_MSG_TYPE = 'order/MsgCancelAll'
export const EDIT_ORDER_MSG_TYPE = 'order/MsgEditOrder'
export const ADD_MARKET_MSG_TYPE = 'market/MsgCreateMarket'
export const INITIATE_SETTLEMENT_MSG_TYPE = 'broker/MsgInitiateSettlement'

// Positions
export const SET_LEVERAGE_MSG_TYPE = 'leverage/MsgSetLeverage'
export const EDIT_MARGIN_MSG_TYPE = 'position/MsgSetMargin'

// Tokens
export const MINT_TOKEN_MSG_TYPE = 'coin/MsgMintToken'
export const CREATE_TOKEN_MSG_TYPE = 'coin/MsgCreateToken'
export const CREATE_WITHDRAWAL_TYPE = 'coin/MsgWithdraw'
export const SEND_TOKENS_TYPE = 'cosmos-sdk/MsgSend'

// Oracle
export const CREATE_ORACLE_TYPE = 'oracle/MsgCreateOracle'
export const CREATE_VOTE_TYPE = 'oracle/MsgCreateVote'

// Staking
export const CREATE_VALIDATOR_MSG_TYPE = 'cosmos-sdk/MsgCreateValidator'
export const DELEGATE_TOKENS_MSG_TYPE = 'cosmos-sdk/MsgDelegate'
export const BEGIN_UNBONDING_TOKENS_MSG_TYPE = 'cosmos-sdk/MsgUndelegate'
export const BEGIN_REDELEGATING_TOKENS_MSG_TYPE = 'cosmos-sdk/MsgBeginRedelegate'
export const WITHDRAW_DELEGATOR_REWARDS_MSG_TYPE = 'cosmos-sdk/MsgWithdrawDelegationReward'

// Accounts
export const CREATE_SUB_ACCOUNT_MSG_TYPE = 'subaccount/MsgCreateSubAccountV2'
export const ACTIVATE_SUB_ACCOUNT_MSG_TYPE = 'subaccount/MsgActivateSubAccountV2'

// Profile
export const UPDATE_PROFILE_MSG_TYPE = 'profile/UpdateProfile'

export const ADD_LIQUIDITY_MSG_TYPE = 'amm/AddLiquidity'
export const REMOVE_LIQUIDITY_MSG_TYPE = 'amm/RemoveLiquidity'
export const CREATE_POOL_MSG_TYPE = 'amm/CreatePool'
export const LINK_POOL_MSG_TYPE = 'amm/LinkPool'
export const UNLINK_POOL_MSG_TYPE = 'amm/UnlinkPool'

// Gov
export const SUBMIT_PROPOSAL_TYPE = 'cosmos-sdk/MsgSubmitProposal'
export const DEPOSIT_PROPOSAL_TYPE = 'cosmos-sdk/MsgDeposit'
export const VOTE_PROPOSAL_TYPE = 'cosmos-sdk/MsgVote'
