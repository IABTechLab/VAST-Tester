import createAction from '../util/createAction'

export const VERIFICATION_READY = 'VERIFICATION_READY'
export const VERIFICATION_SESSION_FINISHED = 'VERIFICATION_SESSION_FINISHED'
export const VERIFICATION_EVENT = 'VERIFICATION_EVENT'
export const VERIFICATION_ERROR_EVENT = 'VERIFICATION_ERROR_EVENT'

export const verificationReady = enabled =>
  createAction(VERIFICATION_READY, {
    enabled
  })

export const verificationSessionFinished = () =>
  createAction(VERIFICATION_SESSION_FINISHED)

export const verificationEvent = type =>
  createAction(VERIFICATION_EVENT, {
    type
  })

export const verificationErrorEvent = (errorType, message) =>
  createAction(VERIFICATION_ERROR_EVENT, {
    errorType,
    message
  })
