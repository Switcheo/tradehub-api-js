import { CreatePool } from "./CreatePool";

export interface CreatePoolWithLiquidity extends CreatePool {
    amount_a: string
    amount_b: string
}