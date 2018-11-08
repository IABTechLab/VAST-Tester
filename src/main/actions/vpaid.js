import errorToString from '../../common/util/errorToString'

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

export const requestVpaidDomUpdate = () => ({
  type: REQUEST_VPAID_DOM_UPDATE
})

export const setVpaidDom = () => ({
  type: SET_VPAID_DOM
})

export const unsetVpaidDom = () => ({
  type: UNSET_VPAID_DOM
})

export const vpaidWarning = message => ({
  type: VPAID_WARNING,
  payload: {
    message
  }
})

export const vpaidError = (message, cause) => ({
  type: VPAID_ERROR,
  payload: {
    message,
    cause
  }
})

export const loadVpaid = url => ({
  type: LOAD_VPAID,
  payload: {
    url
  }
})

export const vpaidLoaded = () => ({
  type: VPAID_LOADED
})

export const vpaidLoadFailed = error => ({
  type: VPAID_LOAD_FAILED,
  payload: {
    error: errorToString(error)
  }
})

export const vpaidAdObtained = () => ({
  type: VPAID_AD_OBTAINED
})

export const callVpaidFunction = (name, args = []) => ({
  type: CALL_VPAID_FUNCTION,
  payload: {
    name,
    args
  }
})

export const callingVpaidFunction = (name, args = []) => ({
  type: CALLING_VPAID_FUNCTION,
  payload: {
    name,
    args
  }
})

export const vpaidHandshakeSuccessful = response => ({
  type: VPAID_HANDSHAKE_SUCCESSFUL,
  payload: {
    response
  }
})

export const startVpaidAd = () => ({
  type: START_VPAID_AD
})

export const vpaidEvent = (name, data) => ({
  type: VPAID_EVENT,
  payload: {
    name,
    data
  }
})

export const setVpaidProperties = properties => ({
  type: SET_VPAID_PROPERTIES,
  payload: {
    properties
  }
})
