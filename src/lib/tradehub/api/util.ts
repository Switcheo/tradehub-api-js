export interface CosmosResponse<T> {
  height: number
  result: T
}

export interface TypedResponse<T> {
  type: string
  value: T
}
