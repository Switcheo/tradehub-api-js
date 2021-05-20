export interface RealizedPnl {
    data: Array<Pnl>
    from_block: string
    from_time: string
    to_block: string
    to_time: string
}

interface Pnl {
    realized_pnl: string
}