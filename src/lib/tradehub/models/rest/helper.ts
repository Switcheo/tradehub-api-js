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
