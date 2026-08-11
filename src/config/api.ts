import axios, { isAxiosError } from 'axios'

import type { AppError } from '@/types/api'

export function toAppError(error: unknown): AppError {
  if (isAxiosError(error)) {
    return {
      message: error.message,
      code: error.code,
      status: error.response?.status,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: 'Erro inesperado na comunicação com a API.',
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://fakestoreapi.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toAppError(error)),
)

export default api
