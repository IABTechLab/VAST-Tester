import errorToString from '../../common/util/errorToString'

export const START_VERIFICATION_SESSION = 'START_VERIFICATION_SESSION'
export const FINISH_VERIFICATION_SESSION = 'FINISH_VERIFICATION_SESSION'
export const SCHEDULE_VERIFICATION_SESSION_FINISH =
  'SCHEDULE_VERIFICATION_SESSION_FINISH'
export const VERIFICATION_SCRIPTS_STARTED = 'VERIFICATION_SCRIPTS_STARTED'
export const LOAD_VERIFICATION_HOST = 'LOAD_VERIFICATION_HOST'
export const VERIFICATION_HOST_LOADED = 'VERIFICATION_HOST_LOADED'
export const VERIFICATION_SCRIPT_LOADED = 'VERIFICATION_SCRIPT_LOADED'
export const VERIFICATION_SCRIPT_LOAD_ERROR = 'VERIFICATION_SCRIPT_LOAD_ERROR'
export const VERIFICATION_SCRIPT_REGISTERING_SESSION_OBSERVER =
  'VERIFICATION_SCRIPT_REGISTERING_SESSION_OBSERVER'
export const VERIFICATION_SCRIPT_SESSION_STARTED =
  'VERIFICATION_SCRIPT_SESSION_STARTED'
export const VERIFICATION_SCRIPT_SESSION_START_ERROR =
  'VERIFICATION_SCRIPT_SESSION_START_ERROR'
export const VERIFICATION_SCRIPT_SENDING_URL = 'VERIFICATION_SCRIPT_SENDING_URL'
export const VERIFICATION_SCRIPT_URL_SENT = 'VERIFICATION_SCRIPT_URL_SENT'
export const VERIFICATION_SCRIPT_URL_SEND_ERROR =
  'VERIFICATION_SCRIPT_URL_SEND_ERROR'
export const VERIFICATION_SCRIPT_INJECTING_JAVASCRIPT_RESOURCE =
  'VERIFICATION_SCRIPT_INJECTING_JAVASCRIPT_RESOURCE'
export const VERIFICATION_SCRIPT_JAVASCRIPT_RESOURCE_INJECTED =
  'VERIFICATION_SCRIPT_JAVASCRIPT_RESOURCE_INJECTED'
export const VERIFICATION_SCRIPT_JAVASCRIPT_RESOURCE_INJECTION_ERROR =
  'VERIFICATION_SCRIPT_JAVASCRIPT_RESOURCE_INJECTION_ERROR'
export const SCHEDULE_VERIFICATION_EVENT = 'SCHEDULE_VERIFICATION_EVENT'
export const VERIFICATION_EVENT = 'VERIFICATION_EVENT'

export const startVerificationSession = () => ({
  type: START_VERIFICATION_SESSION
})

export const scheduleVerificationSessionFinish = (error = null) => ({
  type: SCHEDULE_VERIFICATION_SESSION_FINISH,
  payload: {
    error
  }
})

export const finishVerificationSession = (error = null) => ({
  type: FINISH_VERIFICATION_SESSION,
  payload: {
    error
  }
})

export const loadVerificationHost = (verification, clientId) => ({
  type: LOAD_VERIFICATION_HOST,
  payload: {
    verification,
    clientId
  }
})

export const verificationHostLoaded = (verification, iframeId) => ({
  type: VERIFICATION_HOST_LOADED,
  payload: {
    verification,
    iframeId
  }
})

export const verificationScriptLoaded = verification => ({
  type: VERIFICATION_SCRIPT_LOADED,
  payload: {
    verification
  }
})

export const verificationScriptLoadError = (verification, error) => ({
  type: VERIFICATION_SCRIPT_LOAD_ERROR,
  payload: {
    verification,
    error: errorToString(error)
  }
})

export const verificationScriptRegisteringSessionObserver = (
  verification,
  vendorKey
) => ({
  type: VERIFICATION_SCRIPT_REGISTERING_SESSION_OBSERVER,
  payload: {
    verification,
    vendorKey
  }
})

export const verificationScriptSessionStarted = verification => ({
  type: VERIFICATION_SCRIPT_SESSION_STARTED,
  payload: {
    verification
  }
})

export const verificationScriptSessionStartError = (verification, error) => ({
  type: VERIFICATION_SCRIPT_SESSION_START_ERROR,
  payload: {
    verification,
    error: errorToString(error)
  }
})

export const verificationScriptsStarted = (
  scriptCount,
  sessionFinished = false
) => ({
  type: VERIFICATION_SCRIPTS_STARTED,
  payload: {
    scriptCount,
    sessionFinished
  }
})

export const verificationScriptSendingUrl = (verification, url) => ({
  type: VERIFICATION_SCRIPT_SENDING_URL,
  payload: {
    verification,
    url
  }
})

export const verificationScriptUrlSent = (verification, url) => ({
  type: VERIFICATION_SCRIPT_URL_SENT,
  payload: {
    verification,
    url
  }
})

export const verificationScriptUrlSendError = (verification, url) => ({
  type: VERIFICATION_SCRIPT_URL_SEND_ERROR,
  payload: {
    verification,
    url
  }
})

export const verificationScriptInjectingJavaScriptResource = (
  verification,
  url
) => ({
  type: VERIFICATION_SCRIPT_INJECTING_JAVASCRIPT_RESOURCE,
  payload: {
    url
  }
})

export const verificationScriptJavaScriptResourceInjected = (
  verification,
  url
) => ({
  type: VERIFICATION_SCRIPT_JAVASCRIPT_RESOURCE_INJECTED,
  payload: {
    url
  }
})

export const verificationScriptJavaScriptResourceInjectionError = (
  verification,
  url
) => ({
  type: VERIFICATION_SCRIPT_JAVASCRIPT_RESOURCE_INJECTION_ERROR,
  payload: {
    url
  }
})

export const scheduleVerificationEvent = type => ({
  type: SCHEDULE_VERIFICATION_EVENT,
  payload: {
    type
  }
})

export const verificationEvent = (type, data = {}) => ({
  type: VERIFICATION_EVENT,
  payload: {
    type,
    data
  }
})
