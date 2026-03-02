import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { fetchMe, login, register } from '../api/auth'
import useAuthStore from '../stores/authStore'
import type { RegisterData } from '../types/api'

export function useLogin() {
  const { setTokens, setUser } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (tokens) => {
      setTokens(tokens.access, tokens.refresh)
      // Fetch user profile after login
      fetchMe().then(setUser).catch(() => {})
      navigate('/')
    },
  })
}

export function useRegister() {
  const { setTokens, setUser } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: (result) => {
      setTokens(result.access, result.refresh)
      setUser(result.user)
      navigate('/')
    },
  })
}

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    enabled: isAuthenticated,
  })
}
