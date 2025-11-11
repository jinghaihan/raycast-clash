import type { Mode } from './types'
import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { useEffect, useState } from 'react'
import { getConfigs, patchConfigs } from './api'
import { MODE_CHOICES } from './constants'
import { errorHandler } from './utils'

export default function Command() {
  const [loading, setLoading] = useState<boolean>(false)
  const [mode, setMode] = useState<Mode>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getConfigs()
        setMode(data.mode)
      }
      catch (e) {
        errorHandler(e)
      }
      finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [mode])

  return (
    <List isLoading={loading}>
      {MODE_CHOICES.map((item, index) => (
        <List.Item
          key={index}
          title={item.title}
          accessories={item.value === mode ? [{ icon: Icon.Check }] : []}
          actions={(
            <ActionPanel>
              <Action
                title="Select"
                onAction={async () => {
                  try {
                    setLoading(true)
                    await patchConfigs({ mode: item.value })
                    setMode(item.value)
                  }
                  catch (e) {
                    errorHandler(e)
                  }
                  finally {
                    setLoading(false)
                  }
                }}
              />
            </ActionPanel>
          )}
        />
      ))}
    </List>
  )
}
