export interface CosmosResponse<T> {
  height: number
  result: T
}

export interface TypedResponse<T> {
  type: string
  value: T
}

export interface ResultsMinMax<T> {
  data: T[]
  min: number
  max: number
}
export interface ResultsPaged<T> {
  data: T[]
  current_page: number
  total_pages: number
}
