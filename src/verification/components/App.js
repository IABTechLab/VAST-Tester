import React from 'react'
import VerificationClient from '../omid/VerificationClient'
import { Client } from '../../common/rpc'
import loadScript from '../../common/util/loadScript'
import { APP_VENDOR, APP_VERSION } from '../../common/settings'

const WINDOW_KEY = 'omid3p'

class OmidRpcClient extends Client {
  handleStartSession () {
    window[WINDOW_KEY]._startSession()
  }

  handleFinishSession ({ error }) {
    window[WINDOW_KEY]._finishSession(error)
  }

  handleDispatchEvent ({ event: { type, data } }) {
    window[WINDOW_KEY]._dispatchEvent(type, data)
  }
}

// Not included:
// - omidNativeInfo
// - omidJsInfo.sessionClientVersion
// - omidJsInfo.serviceVersion
// - app
// - deviceInfo
// - customReferenceData
const createAdSessionContext = config => {
  const dom = config.accessMode === 'full' ? window.parent.__sharedDom__ : {}
  const context = {
    apiVersion: '1.0',
    environment: 'web',
    accessMode: config.accessMode,
    videoElement: dom.videoElement,
    slotElement: dom.slotElement,
    adSessionType: 'html',
    omidJsInfo: {
      omidImplementer: APP_VENDOR,
      partnerName: APP_VENDOR,
      partnerVersion: APP_VERSION
    },
    supports: ['clid']
  }
  Object.assign(
    context,
    ...['adServingId', 'transactionId', 'podSequence', 'adCount']
      .filter(key => config[key] != null)
      .map(key => ({ [key]: config[key] }))
  )
  return context
}

const main = async () => {
  const config = JSON.parse(decodeURIComponent(window.location.hash.substr(1)))
  const rpcClient = new OmidRpcClient(config.id, window)
  rpcClient.init()
  const omidClient = new VerificationClient(
    createAdSessionContext(config),
    config.adSessionId,
    config.verificationParameters,
    (type, data) => {
      if (type.substr(0, 7) === 'session') {
        rpcClient.send('acceptSession' + type.substr(7))
      } else {
        rpcClient.send('acceptEvent', { type, data })
      }
    }
  )
  window[WINDOW_KEY] = omidClient
  let error = null
  try {
    await loadScript(config.scriptUri, null, document)
  } catch (err) {
    error = err
  }
  rpcClient.send('acceptScriptInsertionResult', {
    error: error != null ? error.toString() : null
  })
}

class App extends React.Component {
  componentDidMount () {
    main().catch(err => {
      console.error(err)
    })
  }

  render () {
    return null
  }
}

export default App
