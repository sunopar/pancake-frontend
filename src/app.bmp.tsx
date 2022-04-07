import React, { Component } from 'react'
import Provider from './Providers'
import './style.scss'
import { init, bindRequest } from '@binance/sentry-miniapp'
import { getEnv } from 'utils/bmp/getEnv'

declare const COMMIT_ID: string
declare const env: any

init({
  dsn: 'https://c4641904bb124a01adcbf53b19b94f3d@o529943.ingest.sentry.io/6227528',
  autoSessionTracking: true,
  tracesSampleRate: 1,
  environment: getEnv(),
  release: `${COMMIT_ID}`,
  beforeBreadcrumb(breadcrumb, hint) {
    if ((breadcrumb.level === 'debug' || breadcrumb.level === 'info') && breadcrumb.category === 'console') {
      return null
    }
    return breadcrumb
  },
})
bn.request = bindRequest(bn.request)
__mp_private_api__.request = bindRequest(__mp_private_api__.request)

class App extends Component {
  componentDidMount() {
    console.log('🚀 ~ file: app.bmp.tsx ~ line 39 ~ App ~ componentDidMount ~ componentDidMount')
  }

  componentDidShow() {
    console.log('🚀 ~ file: app.bmp.tsx ~ line 44 ~ App ~ componentDidShow ~ componentDidShow')
  }

  componentDidHide() {}

  componentDidCatchError() {}

  render() {
    console.log('🚀 ~ file: app.bmp.tsx ~ line 51 ~ App ~ render ~ render')
    const { children } = this.props
    return <Provider>{children}</Provider>
  }
}

export default App
