import apiClient from './client'
import type { AuthTokens, RegisterData, User } from '../types/api'

export async function login(
  email: string,
  password: string
): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/accounts/login/', {
    email,
    password,
  })
  return data
}

export async function register(
  payload: RegisterData
): Promise<AuthTokens & { user: User }> {
  const { data } = await apiClient.post<AuthTokens & { user: User }>(
    '/accounts/register/',
    payload
  )
  return data
}

export async function refreshToken(refresh: string): Promise<{ access: string }> {
  const { data } = await apiClient.post<{ access: string }>(
    '/accounts/token/refresh/',
    { refresh }
  )
  return data
}

export async function fetchMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/accounts/me/')
  return data
}

export async function updateMe(payload: Partial<User>): Promise<User> {
  const { data } = await apiClient.patch<User>('/accounts/me/', payload)
  return data
}
