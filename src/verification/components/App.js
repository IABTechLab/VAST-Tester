import React from 'react'
import VerificationClient from '../omid/VerificationClient'
import { Client } from '../../common/rpc'
import loadScript from '../../common/util/loadScript'
import startsWith from '../../common/util/startsWith'
import { APP_VENDOR, APP_VERSION } from '../../common/settings'

const WINDOW_KEY = 'omid3p'
const SESSION_EVENT_TYPE_PREFIX = 'session'
const OPTIONAL_CONTEXT_PROPERTY_NAMES = [
  'adServingId',
  'transactionId',
  'podSequence',
  'adCount'
]

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
      serviceVersion: APP_VERSION,
      partnerName: APP_VENDOR,
      partnerVersion: APP_VERSION
    }
  }
  Object.assign(
    context,
    ...OPTIONAL_CONTEXT_PROPERTY_NAMES.filter(key => config[key] != null).map(
      key => ({ [key]: config[key] })
    )
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
      if (startsWith(type, SESSION_EVENT_TYPE_PREFIX)) {
        const action =
          'acceptSession' + type.substr(SESSION_EVENT_TYPE_PREFIX.length)
        rpcClient.send(action)
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
  } finally {
    rpcClient.send('acceptScriptInsertionResult', {
      error: error != null ? error.toString() : null
    })
  }
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
