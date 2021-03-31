export const VERIFICATION_READY = 'VERIFICATION_READY'
export const VERIFICATION_SESSION_FINISHED = 'VERIFICATION_SESSION_FINISHED'
export const VERIFICATION_EVENT = 'VERIFICATION_EVENT'
export const VERIFICATION_ERROR_EVENT = 'VERIFICATION_ERROR_EVENT'

export const verificationReady = enabled => ({
  type: VERIFICATION_READY,
  payload: {
    enabled
  }
})

export const verificationSessionFinished = () => ({
  type: VERIFICATION_SESSION_FINISHED
})

export const verificationEvent = type => ({
  type: VERIFICATION_EVENT,
  payload: {
    type
  }
})

export const verificationErrorEvent = (errorType, message) => ({
  type: VERIFICATION_ERROR_EVENT,
  payload: {
    errorType,
    message
  }
})
