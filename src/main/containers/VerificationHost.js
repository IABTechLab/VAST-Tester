import React from 'react'
import { connect } from 'react-redux'
import {
  loadVerificationHost,
  verificationHostLoaded,
  verificationScriptRegisteringSessionObserver
} from '../actions'
import verificationServer from '../util/verificationServer'
import { APP_URL_ALT } from '../../common/settings'

let idCount = 0

const buildIframeUrl = (
  clientId,
  scriptUri,
  verificationParameters,
  accessMode,
  adServingId,
  transactionId,
  podSequence,
  adCount
) => {
  const clientConfig = {
    id: clientId,
    scriptUri,
    adSessionId: clientId,
    verificationParameters,
    accessMode,
    adServingId,
    transactionId,
    podSequence,
    adCount
  }
  return (
    (accessMode === 'limited' ? APP_URL_ALT : '') +
    '/?mode=verification#' +
    encodeURIComponent(JSON.stringify(clientConfig))
  )
}

const VerificationHost = ({
  verification,
  adServingId,
  transactionId,
  podSequence,
  adCount,
  onLoading,
  onLoaded,
  onEvent
}) => {
  const iframeId = 'verification-host-' + idCount++
  let client
  const acceptIframeRef = iframe => {
    if (iframe == null) {
      return
    }
    client = verificationServer.addClient(onEvent)
    iframe.src = buildIframeUrl(
      client.id,
      verification.uri,
      verification.verificationParameters,
      verification.accessMode,
      adServingId,
      transactionId,
      podSequence,
      adCount
    )
    onLoading(verification, client.id)
  }
  const onIframeLoaded = () => {
    onLoaded(verification, iframeId)
  }
  return (
    <div className='verification-host'>
      <iframe
        id={iframeId}
        title={verification.vendor}
        ref={acceptIframeRef}
        onLoad={onIframeLoaded}
      />
    </div>
  )
}

const mapProp = (factory, name) => (verification, data) =>
  factory(verification, data[name])

const eventTypeToFactory = {
  registeringSessionObserver: mapProp(
    verificationScriptRegisteringSessionObserver,
    'vendorKey'
  )
}

const mapDispatchToProps = (dispatch, { verification }) => ({
  onLoading: (verification, clientId) => {
    dispatch(loadVerificationHost(verification, clientId))
  },
  onLoaded: (verification, iframeId) => {
    dispatch(verificationHostLoaded(verification, iframeId))
  },
  onEvent: evt => {
    const { type, data } = evt
    const factory = eventTypeToFactory[type]
    if (factory != null) {
      dispatch(factory(verification, data))
    }
  }
})

export default connect(null, mapDispatchToProps)(VerificationHost)
