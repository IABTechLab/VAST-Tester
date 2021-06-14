import createAction from '../util/createAction'

export const VAST_WARNING = 'VAST_WARNING'
export const LOAD_VAST = 'LOAD_VAST'
export const VAST_LOADED = 'VAST_LOADED'
export const VAST_LOAD_FAILED = 'VAST_LOAD_FAILED'
export const UNSUPPORTED_MEDIA_FILES = 'UNSUPPORTED_MEDIA_FILES'
export const SET_MEDIA_FILE = 'SET_MEDIA_FILE'
export const VAST_EVENT = 'VAST_EVENT'

export const vastWarning = (message, url) =>
  createAction(VAST_WARNING, {
    message,
    url
  })

export const loadVast = () => createAction(LOAD_VAST)

export const vastLoaded = (chain, inLine, linear, verifications) =>
  createAction(VAST_LOADED, {
    chain,
    inLine,
    linear,
    verifications
  })

export const vastLoadFailed = error =>
  createAction(VAST_LOAD_FAILED, {
    error
  })

export const unsupportedMediaFiles = () => createAction(UNSUPPORTED_MEDIA_FILES)

export const setMediaFile = (url, apiFramework, adParameters) =>
  createAction(SET_MEDIA_FILE, {
    url,
    apiFramework,
    adParameters
  })

export const vastEvent = type =>
  createAction(VAST_EVENT, {
    type
  })
