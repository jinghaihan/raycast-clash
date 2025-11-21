import type { Proxy } from './types'
import { Action, ActionPanel, Color, Icon, List } from '@raycast/api'
import { useEffect, useState } from 'react'
import { getProxies, getProxyDelay, selectProxy } from './api'
import { PROXY_GROUPS } from './constants'
import { preferences } from './preferences'
import { errorHandler } from './utils'

interface ProxyGroupProps {
  name: string
  proxies: string[]
  current?: string
  selectable: boolean
  refresh: () => void
}

export default function Command() {
  const [loading, setLoading] = useState<boolean>(false)
  const [refresh, setRefresh] = useState<boolean>(false)
  const [proxies, setProxies] = useState<Proxy[]>([])

  const getGlobalProxies = (proxies: Record<string, Proxy>) => {
    for (const [k, v] of Object.entries(proxies)) {
      if (k === 'GLOBAL' && v.all)
        return v.all
    }
    return []
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getProxies()
        const globalProxies = getGlobalProxies(data)
        const proxies: Proxy[] = Object.values(data)
          .filter(({ type }) => PROXY_GROUPS.includes(type))
          .sort(({ name: a }, { name: b }) => globalProxies.indexOf(a) - globalProxies.indexOf(b))
        setProxies(proxies)
      }
      catch (e) {
        errorHandler(e)
      }
      finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [refresh])

  return (
    <List isLoading={loading}>
      {proxies.map((proxy, index) => {
        return (
          <List.Item
            key={index}
            title={proxy.name}
            subtitle={proxy.type}
            accessories={proxy.now ? [{ text: proxy.now }] : []}
            actions={(
              <ActionPanel>
                <Action.Push
                  title="Show Proxies"
                  icon={Icon.List}
                  target={(
                    <ProxyGroup
                      name={proxy.name}
                      proxies={proxy.all}
                      current={proxy.now}
                      refresh={() => setRefresh(!refresh)}
                      selectable={proxy.type === 'Selector'}
                    />
                  )}
                />
              </ActionPanel>
            )}
          />
        )
      })}
    </List>
  )
}

function ProxyGroup({ name, proxies, current, selectable, refresh }: ProxyGroupProps) {
  const [select, setSelect] = useState<string | undefined>(current)
  const [loading, setLoading] = useState(false)
  const [delays, setDelays] = useState<Record<string, number>>({})

  const getDelayColor = (delay: number) => {
    if (delay === 0)
      return Color.Red
    if (delay < 300)
      return Color.Green
    return Color.Yellow
  }

  const getAccessories = (proxy: string) => {
    const accessories: List.Item.Accessory[] = []

    if (proxy === select)
      accessories.push({ icon: Icon.Check, tooltip: 'Current' })

    if (typeof delays[proxy] === 'number') {
      accessories.push({
        tag: {
          color: getDelayColor(delays[proxy]),
          value: delays[proxy] === 0 ? 'ERROR' : `${delays[proxy]}ms`,
        },
      })
    }

    return accessories
  }

  const getDelay = async (proxy: string) => {
    const delay = await getProxyDelay(
      proxy,
      Number(preferences.benchmarkTimeout),
      preferences.benchmarkUrl,
    )
    refresh()
    setDelays(prevDelays => ({ ...prevDelays, [proxy]: delay }))
  }

  return (
    <List isLoading={loading}>
      {proxies.map((proxy, index) =>
        selectable
          ? (
              <List.Item
                key={index}
                title={proxy}
                accessories={getAccessories(proxy)}
                actions={(
                  <ActionPanel>
                    <Action
                      title="Select"
                      icon={Icon.Globe}
                      onAction={async () => {
                        try {
                          setLoading(true)
                          await selectProxy(name, proxy)
                          refresh()
                          setSelect(proxy)
                        }
                        catch (e) {
                          errorHandler(e)
                        }
                        finally {
                          setLoading(false)
                        }
                      }}
                    />
                    <Action
                      title="Benchmark"
                      icon={Icon.Clock}
                      shortcut={{ modifiers: ['cmd'], key: 't' }}
                      onAction={async () => {
                        try {
                          setLoading(true)
                          await getDelay(proxy)
                        }
                        catch (e) {
                          setDelays({ ...delays, [proxy]: 0 })
                          errorHandler(e)
                        }
                        finally {
                          setLoading(false)
                        }
                      }}
                    />
                    <Action
                      title="Benchmark All"
                      icon={Icon.Clock}
                      shortcut={{ modifiers: ['cmd', 'shift'], key: 't' }}
                      onAction={async () => {
                        try {
                          setLoading(true)
                          for (const proxy of proxies) {
                            await getDelay(proxy)
                          }
                          refresh()
                        }
                        catch (e) {
                          errorHandler(e)
                        }
                        finally {
                          setLoading(false)
                        }
                      }}
                    >
                    </Action>
                    <Action
                      title="Clear Benchmark"
                      icon={Icon.Trash}
                      shortcut={{ modifiers: ['cmd'], key: 'r' }}
                      onAction={() => {
                        setDelays({})
                      }}
                    >
                    </Action>
                  </ActionPanel>
                )}
              />
            )
          : (
              <List.Item key={index} title={proxy} accessories={getAccessories(proxy)} />
            ),
      )}
    </List>
  )
}
