import { showToast, Toast } from '@raycast/api'
import { preferences } from './preferences'
import { toggleProxy } from './scripts'
import { errorHandler } from './utils'

export default async function Command() {
  try {
    await toggleProxy(preferences.app)
    showToast({
      title: `${preferences.app} proxy is toggled`,
      style: Toast.Style.Success,
    })
  }
  catch (e) {
    errorHandler(e)
  }
}
