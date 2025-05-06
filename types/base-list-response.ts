export type BaseListResponse<T> = {
  data: T
  cursor: string
  element: number
}
