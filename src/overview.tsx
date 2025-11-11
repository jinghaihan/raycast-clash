import { Icon, List } from '@raycast/api'
import { useConnections, useTraffic } from './api'
import { formatBytes } from './utils'

export default function Command() {
  const { traffic, loading: trafficLoading } = useTraffic()
  const { connections, loading: connectionsLoading } = useConnections()

  return (
    <List isLoading={trafficLoading || connectionsLoading}>
      <List.Item
        key="trafficUp"
        icon={Icon.ChevronUp}
        title="Upload"
        accessories={[{ text: `${formatBytes(traffic.up)}/s` }]}
      />
      <List.Item
        key="trafficDown"
        icon={Icon.ChevronDown}
        title="Download"
        accessories={[{ text: `${formatBytes(traffic.down)}/s` }]}
      />
      <List.Item
        key="uploadTotal"
        icon={Icon.Upload}
        title="Upload Total"
        accessories={[{ text: `${formatBytes(connections.uploadTotal)}/s` }]}
      />
      <List.Item
        key="downloadTotal"
        icon={Icon.Download}
        title="Download Total"
        accessories={[{ text: `${formatBytes(connections.downloadTotal)}/s` }]}
      />
      <List.Item
        key="connections"
        icon={Icon.LevelMeter}
        title="Active Connections"
        accessories={[{ text: `${connections.connections.length}` }]}
      />
    </List>
  )
}
