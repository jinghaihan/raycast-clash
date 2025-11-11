import type { LogLevel } from './types'
import { Color } from '@raycast/api'

export const SET_AS_SYSTEM_PROXY = [
  'Set as system proxy',
  '设置为系统代理',
]

export const PROXY_GROUPS = ['Selector', 'URLTest', 'Fallback', 'LoadBalance', 'Relay']

export const BENCH_MARK_TIMEOUT = 5000

export const BENCH_MARK_URL = 'http://cp.cloudflare.com/generate_204'

export const MODE_CHOICES = [
  {
    title: '全局连接 (Global)',
    value: 'global',
  },
  {
    title: '规则判断 (Rule)',
    value: 'rule',
  },
  {
    title: '脚本模式 (Script)',
    value: 'script',
  },
  {
    title: '直接连接 (Direct)',
    value: 'direct',
  },
] as const

export const LOG_LEVELS = ['error', 'warning', 'info', 'debug'] as const

export const LOG_LEVEL_COLORS: Record<LogLevel, Color> = {
  debug: Color.Green,
  info: Color.Blue,
  warning: Color.Yellow,
  error: Color.Red,
}
