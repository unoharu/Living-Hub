export interface Article {
  id: number
  title: string
  content: string
  author_name: string
  created_at: string
  updated_at: string
}

export interface CreateArticleData {
  title: string
  content: string
}
