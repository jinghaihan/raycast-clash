import type { QueryObject } from 'ufo'
import { showToast, Toast } from '@raycast/api'
import { ofetch } from 'ofetch'
import { encodePath, stringifyQuery, withoutTrailingSlash } from 'ufo'
import WebSocket from 'ws'
import { preferences } from './preferences'

export async function request<T = any>(options: {
  endpoint: string
  method?: 'GET' | 'PUT' | 'PATCH'
  body?: Record<string, unknown>
  params?: QueryObject
}) {
  const query = options.params ? `?${stringifyQuery(options.params)}` : ''
  const path = encodePath(
    `${withoutTrailingSlash(preferences.url)}/${withoutTrailingSlash(options.endpoint)}`,
  )
  return ofetch<T>(`${path}${query}`, {
    method: options.method,
    headers: preferences.secret ? { Authorization: `Bearer ${preferences.secret}` } : {},
    body: options.body,
  })
}

export function wsRequest<T = any>(options: {
  endpoint: string
  onMessage: (data: T) => void
  onError?: (error: unknown) => void
  params?: QueryObject
}) {
  const query = options.params ? `?${stringifyQuery(options.params)}` : ''
  const path = encodePath(
    `${withoutTrailingSlash(preferences.url.replace(/^http/, 'ws'))}/${withoutTrailingSlash(options.endpoint)}`,
  )
  const ws = new WebSocket(`${path}${query}`, {
    headers: preferences.secret ? { Authorization: `Bearer ${preferences.secret}` } : {},
  })

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString()) as T
      options.onMessage(data)
    }
    catch (e) {
      errorHandler(e)
      options.onError?.(e)
    }
  })

  ws.on('error', (error) => {
    errorHandler(error)
    options.onError?.(error)
  })

  return () => {
    if (ws.readyState === WebSocket.OPEN)
      ws.close()
  }
}

export function errorHandler(e: unknown) {
  console.error(e)
  showToast({
    title: e instanceof Error ? e.message : 'Unknown error',
    style: Toast.Style.Failure,
  })
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0)
    return '0 B'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
