export interface TokenObject {
    asset_id: string
    blockchain: string
    chain_id: number
    decimals: number
    delegated_supply: string
    denom: string
    is_active: boolean
    is_collateral: boolean
    lock_proxy_hash: string
    name: string
    originator: string
    symbol: string
    external_balance: string
}

export interface TokenList extends Array<TokenObject> {}
