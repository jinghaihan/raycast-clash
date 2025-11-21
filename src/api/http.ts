import type { Config, Proxy, Rule } from '../types'
import { BENCHMARK_TIMEOUT, BENCHMARK_URL } from '../constants'
import { request } from '../utils'

export async function getConfigs(): Promise<Config> {
  return await request<Config>({ endpoint: 'configs' })
}

export async function patchConfigs(config: Partial<Config>): Promise<void> {
  return await request({
    endpoint: 'configs',
    method: 'PATCH',
    body: config,
  })
}

export async function getProxies(): Promise<Record<string, Proxy>> {
  const { proxies } = await request<{ proxies: Record<string, Proxy> }>({ endpoint: 'proxies' })
  return proxies
}

export async function selectProxy(name: string, proxy: string): Promise<void> {
  await request({
    endpoint: `proxies/${name}`,
    method: 'PUT',
    body: { name: proxy },
  })
}

export async function getProxyDelay(
  name: string,
  timeout: number = BENCHMARK_TIMEOUT,
  benchmarkUrl: string = BENCHMARK_URL,
): Promise<number> {
  if (Number.isNaN(timeout))
    timeout = BENCHMARK_TIMEOUT

  const { delay } = await request<{ delay: number }>({
    endpoint: `proxies/${name}/delay`,
    method: 'GET',
    params: {
      timeout,
      url: benchmarkUrl,
    },
  })
  return delay
}

export async function getRules(): Promise<Rule[]> {
  const { rules } = await request<{ rules: Rule[] }>({ endpoint: 'rules' })
  return rules
}
