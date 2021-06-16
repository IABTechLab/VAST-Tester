import createAction from '../util/createAction'

export const VIDEO_WARNING = 'VIDEO_WARNING'
export const REQUEST_VIDEO_ELEMENT_UPDATE = 'REQUEST_VIDEO_ELEMENT_UPDATE'
export const SET_VIDEO_ELEMENT = 'SET_VIDEO_ELEMENT'
export const UNSET_VIDEO_ELEMENT = 'SET_VIDEO_ELEMENT'
export const SET_VIDEO_SRC = 'SET_VIDEO_SRC'
export const SET_VIDEO_PAUSED = 'SET_VIDEO_PAUSED'
export const SET_VIDEO_MUTED = 'SET_VIDEO_MUTED'
export const SET_VIDEO_PROPERTIES = 'SET_VIDEO_PROPERTIES'
export const VIDEO_PLAY_PROMISE = 'VIDEO_PLAY_PROMISE'
export const VIDEO_PLAY_NO_PROMISE = 'VIDEO_PLAY_NO_PROMISE'
export const VIDEO_PLAY_PROMISE_FULFILLED = 'VIDEO_PLAY_PROMISE_FULFILLED'
export const VIDEO_PLAY_PROMISE_REJECTED = 'VIDEO_PLAY_PROMISE_REJECTED'
export const VIDEO_EVENT = 'VIDEO_EVENT'

export const videoWarning = message =>
  createAction(VIDEO_WARNING, {
    message
  })

export const requestVideoElementUpdate = () =>
  createAction(REQUEST_VIDEO_ELEMENT_UPDATE)

export const setVideoElement = () => createAction(SET_VIDEO_ELEMENT)

export const unsetVideoElement = () => createAction(UNSET_VIDEO_ELEMENT)

export const setVideoSrc = src =>
  createAction(SET_VIDEO_SRC, {
    src
  })

export const setVideoPaused = paused =>
  createAction(SET_VIDEO_PAUSED, {
    paused
  })

export const setVideoMuted = muted =>
  createAction(SET_VIDEO_MUTED, {
    muted
  })

export const setVideoProperties = properties =>
  createAction(SET_VIDEO_PROPERTIES, {
    properties
  })

export const videoPlayPromise = () => createAction(VIDEO_PLAY_PROMISE)

export const videoPlayNoPromise = () => createAction(VIDEO_PLAY_NO_PROMISE)

export const videoPlayPromiseFulfilled = () =>
  createAction(VIDEO_PLAY_PROMISE_FULFILLED)

export const videoPlayPromiseRejected = error =>
  createAction(VIDEO_PLAY_PROMISE_REJECTED, {
    error
  })

export const videoEvent = type =>
  createAction(VIDEO_EVENT, {
    type
  })
