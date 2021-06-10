import dayjs from "dayjs"

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

export const parseCosmosDate = (input?: string) => {
  if (typeof input !== 'string') return undefined
  if (input.startsWith('0001')) return undefined // cosmos null date 0001-01-01T00:00:00Z
  const result = dayjs(input)
  if (result.unix() === 0) return undefined

  return result
}
