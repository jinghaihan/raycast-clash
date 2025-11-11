import { runAppleScript } from 'run-applescript'
import { SET_AS_SYSTEM_PROXY } from './constants'

export async function toggleProxy(app: string) {
  const menus = await runAppleScript(`
    tell application "System Events"
      tell process "${app}"
        get name of every menu item of menu 1 of menu bar item 1 of menu bar 2
      end tell
    end tell
  `)

  const index = menus
    .split(',')
    .map(item => item.trim())
    .findIndex(item => SET_AS_SYSTEM_PROXY.includes(item))
  if (index === -1)
    throw new Error('Set as system proxy menu not found')

  await runAppleScript(`
    tell application "System Events"
      tell process "${app}"
        click menu bar item 1 of menu bar 2
        click menu item ${index + 1} of menu 1 of menu bar item 1 of menu bar 2
      end tell
    end tell
  `)
}
