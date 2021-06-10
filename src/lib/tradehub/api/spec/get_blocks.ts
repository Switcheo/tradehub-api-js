export interface GetBlocksOpts {
	page?: number
	limit?: number
	order_by?: string
	before_id?: string
	after_id?: string
	proposer?: string
}
