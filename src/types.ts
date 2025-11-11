import type { LOG_LEVELS, MODE_CHOICES } from './constants'

export type Mode = (typeof MODE_CHOICES)[number]['value']

export type LogLevel = (typeof LOG_LEVELS)[number]

export interface Config {
  'port': number
  'socks-port': number
  'redir-port': number
  'tproxy-port': number
  'mixed-port': number
  'authentication': string[]
  'allow-lan': false
  'bind-address': string
  'mode': Mode
  'log-level': LogLevel
  'ipv6': boolean
}

export interface Proxy {
  all: string[]
  history: []
  name: string
  now?: string
  type: string
  udp: boolean
}

export interface Rule {
  type: string
  payload: string
  proxy: string
}

export interface Traffic {
  up: number
  down: number
}

export interface ConnectionData {
  downloadTotal: number
  uploadTotal: number
  connections: Connection[]
}

export interface Connection {
  id: string
  metadata: ConnectionMetadata
  upload: number
  download: number
  start: string
  chains: string[]
  rule: string
  rulePayload: string
}

export interface ConnectionMetadata {
  network: string
  type: string
  sourceIP: string
  destinationIP: string
  sourcePort: string
  destinationPort: string
  host: string
  dnsMode: string
  processPath: string
  specialProxy: string
}

export interface Log {
  type: LogLevel
  payload: string
  time?: string
}
