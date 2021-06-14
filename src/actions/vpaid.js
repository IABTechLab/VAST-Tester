import createAction from '../util/createAction'

export const REQUEST_VPAID_DOM_UPDATE = 'REQUEST_VPAID_DOM_UPDATE'
export const SET_VPAID_DOM = 'SET_VPAID_DOM'
export const UNSET_VPAID_DOM = 'UNSET_VPAID_DOM'
export const VPAID_WARNING = 'VPAID_WARNING'
export const VPAID_ERROR = 'VPAID_ERROR'
export const LOAD_VPAID = 'LOAD_VPAID'
export const VPAID_AD_OBTAINED = 'VPAID_AD_OBTAINED'
export const VPAID_HANDSHAKE_SUCCESSFUL = 'VPAID_HANDSHAKE_SUCCESSFUL'
export const START_VPAID_AD = 'START_VPAID_AD'
export const VPAID_EVENT = 'VPAID_EVENT'
export const SET_VPAID_PROPERTIES = 'SET_VPAID_PROPERTIES'
export const CALL_VPAID_FUNCTION = 'CALL_VPAID_FUNCTION'
export const CALLING_VPAID_FUNCTION = 'CALLING_VPAID_FUNCTION'
export const VPAID_LOADED = 'VPAID_LOADED'
export const VPAID_LOAD_FAILED = 'VPAID_LOAD_FAILED'

export const requestVpaidDomUpdate = () =>
  createAction(REQUEST_VPAID_DOM_UPDATE)

export const setVpaidDom = () => createAction(SET_VPAID_DOM)

export const unsetVpaidDom = () => createAction(UNSET_VPAID_DOM)

export const vpaidWarning = message =>
  createAction(VPAID_WARNING, {
    message
  })

export const vpaidError = (message, cause) =>
  createAction(VPAID_ERROR, {
    message,
    cause
  })

export const loadVpaid = url =>
  createAction(LOAD_VPAID, {
    url
  })

export const vpaidLoaded = () => createAction(VPAID_LOADED)

export const vpaidLoadFailed = error =>
  createAction(VPAID_LOAD_FAILED, {
    error
  })

export const vpaidAdObtained = () => createAction(VPAID_AD_OBTAINED)

export const callVpaidFunction = (name, args = []) =>
  createAction(CALL_VPAID_FUNCTION, {
    name,
    args
  })

export const callingVpaidFunction = (name, args = []) =>
  createAction(CALLING_VPAID_FUNCTION, {
    name,
    args
  })

export const vpaidHandshakeSuccessful = response =>
  createAction(VPAID_HANDSHAKE_SUCCESSFUL, {
    response
  })

export const startVpaidAd = () => createAction(START_VPAID_AD)

export const vpaidEvent = (name, data) =>
  createAction(VPAID_EVENT, {
    name,
    data
  })

export const setVpaidProperties = properties =>
  createAction(SET_VPAID_PROPERTIES, {
    properties
  })
