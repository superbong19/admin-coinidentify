export interface Page {
  id: string
  title: string
  content: string
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
}
