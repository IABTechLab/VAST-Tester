import errorToString from '../util/errorToString'

export const VAST_WARNING = 'VAST_WARNING'
export const LOAD_VAST = 'LOAD_VAST'
export const VAST_LOADED = 'VAST_LOADED'
export const VAST_LOAD_FAILED = 'VAST_LOAD_FAILED'
export const UNSUPPORTED_MEDIA_FILES = 'UNSUPPORTED_MEDIA_FILES'
export const SET_MEDIA_FILE = 'SET_MEDIA_FILE'
export const VAST_EVENT = 'VAST_EVENT'

export const vastWarning = (message, url) => ({
  type: VAST_WARNING,
  payload: {
    message,
    url
  }
})

export const loadVast = () => ({
  type: LOAD_VAST
})

export const vastLoaded = (chain, inLine, linear, verifications) => ({
  type: VAST_LOADED,
  payload: {
    chain,
    inLine,
    linear,
    verifications
  }
})

export const vastLoadFailed = error => ({
  type: VAST_LOAD_FAILED,
  payload: {
    error: errorToString(error)
  }
})

export const unsupportedMediaFiles = () => ({
  type: UNSUPPORTED_MEDIA_FILES
})

export const setMediaFile = (url, apiFramework, adParameters) => ({
  type: SET_MEDIA_FILE,
  payload: {
    url,
    apiFramework,
    adParameters
  }
})

export const vastEvent = type => ({
  type: VAST_EVENT,
  payload: {
    type
  }
})
