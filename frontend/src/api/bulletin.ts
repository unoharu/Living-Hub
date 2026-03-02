import apiClient from './client'
import type { PaginatedResponse } from '../types/api'
import type { Article, CreateArticleData } from '../types/bulletin'

export function getArticles() {
  return apiClient
    .get<PaginatedResponse<Article>>('/bulletin/articles/')
    .then((r) => r.data.results)
}

export function createArticle(data: CreateArticleData) {
  return apiClient.post<Article>('/bulletin/articles/create/', data).then((r) => r.data)
}
