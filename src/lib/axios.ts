import axios, { AxiosError } from 'axios'
import type { AxiosResponse } from 'axios'
import type { AxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_V3RII_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5263'

export type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
}

const appendPathSegment = (url: string | undefined, segment: string) => {
  if (!url) return url
  const [path, query] = url.split('?')
  const nextPath = path.endsWith(`/${segment}`) ? path : `${path.replace(/\/$/, '')}/${segment}`
  return query ? `${nextPath}?${query}` : nextPath
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const originalMethod = (config.method ?? 'get').toLowerCase()

  if (config.useNativeHttpMethod !== true) {
    if (originalMethod === 'put') {
      config.method = 'post'
      config.url = appendPathSegment(config.url, 'update')
    }

    if (originalMethod === 'delete') {
      config.method = 'post'
      config.url = appendPathSegment(config.url, 'delete')
    }
  }

  const token = config.authToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const unwrapResponse = (response: AxiosResponse) => {
    const payload = response.data as ApiResponse<unknown> | unknown
    if (payload && typeof payload === 'object' && 'success' in payload && 'message' in payload) {
      const envelope = payload as ApiResponse<unknown>
      if (!envelope.success) {
        throw new Error(envelope.message || 'API request failed')
      }
      return envelope.data ?? envelope
    }

    return payload
}

api.interceptors.response.use(
  unwrapResponse as unknown as (response: AxiosResponse) => AxiosResponse,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const message = error.response?.data?.message || error.message || 'API request failed'
    return Promise.reject(new Error(message))
  }
)

export const withAuth = (token: string): AxiosRequestConfig => ({
  authToken: token
})

declare module 'axios' {
  export interface AxiosRequestConfig {
    authToken?: string
    useNativeHttpMethod?: boolean
  }

  export interface AxiosInstance {
    get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
    put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
    delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
    patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  }
}
