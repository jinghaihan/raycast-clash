import type { ConnectionData, Log, LogLevel, Traffic } from '../types'
import { useEffect, useState } from 'react'
import { wsRequest } from '../utils'

export function useTraffic(): { traffic: Traffic, loading: boolean } {
  const [loading, setLoading] = useState<boolean>(true)
  const [traffic, setTraffic] = useState<Traffic>({
    up: 0,
    down: 0,
  })

  useEffect(() => {
    const cleanup = wsRequest<Traffic>({
      endpoint: 'traffic',
      onMessage: (data) => {
        setTraffic(data)
        setLoading(false)
      },
    })
    return () => {
      cleanup()
    }
  }, [])

  return { traffic, loading }
}

export function useConnections(): { connections: ConnectionData, loading: boolean } {
  const [loading, setLoading] = useState<boolean>(true)
  const [connections, setConnections] = useState<ConnectionData>({
    downloadTotal: 0,
    uploadTotal: 0,
    connections: [],
  })

  useEffect(() => {
    const cleanup = wsRequest<ConnectionData>({
      endpoint: 'connections',
      onMessage: (data) => {
        setConnections(data)
        setLoading(false)
      },
    })
    return () => {
      cleanup()
    }
  }, [])

  return { connections, loading }
}

export function useLogs() {
  const [loading, setLoading] = useState<boolean>(true)
  const [logLevel, setLogLevel] = useState<LogLevel>('info')
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    const cleanup = wsRequest<Log>({
      endpoint: 'logs',
      params: {
        level: logLevel,
      },
      onMessage: (data) => {
        setLogs(prevLogs => [
          data,
          ...prevLogs,
        ])
        setLoading(false)
      },
    })
    return () => {
      cleanup()
    }
  }, [logLevel])

  return { logs, loading, logLevel, setLogLevel }
}
