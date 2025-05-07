export type BaseListResponse<T> = {
  data: T[]
  hasMore: boolean
  element: number
  total: number
}
