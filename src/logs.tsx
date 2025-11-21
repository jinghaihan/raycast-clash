import type { Log, LogLevel } from './types'
import { Action, ActionPanel, Detail, Icon, List } from '@raycast/api'
import { useMemo, useState } from 'react'
import { useLogs } from './api'
import { LOG_LEVEL_COLORS, LOG_LEVELS } from './constants'
import { capitalize } from './utils'

export default function Command() {
  const { logs, loading, logLevel, setLogLevel } = useLogs()
  const [searchText, setSearchText] = useState<string>('')

  const filteredList = useMemo(() => {
    return logs.filter((item: Log) => item.payload.includes(searchText))
  }, [searchText, logs])

  return (
    <List
      isLoading={loading}
      filtering={false}
      onSearchTextChange={setSearchText}
      searchBarAccessory={<LogLevelDropdown logLevel={logLevel} onChange={setLogLevel} />}
    >
      {filteredList.map((log, index) => (
        <List.Item
          icon={{ source: Icon.Circle, tintColor: LOG_LEVEL_COLORS[log.type] }}
          key={index}
          title={log.time ? log.time : ''}
          subtitle={log.payload}
          actions={(
            <ActionPanel>
              <Action.Push
                title="Show Detail"
                icon={Icon.CodeBlock}
                target={
                  <Detail markdown={`\`\`\`\n${log.payload}\n\`\`\``} />
                }
              />
            </ActionPanel>
          )}
        />
      ))}
    </List>
  )
}

export function LogLevelDropdown(props: { logLevel: LogLevel, onChange: (value: LogLevel) => void }) {
  return (
    <List.Dropdown
      tooltip="Select Log Level"
      defaultValue={props.logLevel}
      storeValue
      onChange={value => props.onChange(value as LogLevel)}
    >
      {LOG_LEVELS.map(item => (
        <List.Dropdown.Item key={item} title={capitalize(item)} value={item} />
      ))}
    </List.Dropdown>
  )
}
