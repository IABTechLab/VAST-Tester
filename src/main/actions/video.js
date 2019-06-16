import errorToString from '../../common/util/errorToString'

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

export const videoWarning = message => ({
  type: VIDEO_WARNING,
  payload: {
    message
  }
})

export const requestVideoElementUpdate = () => ({
  type: REQUEST_VIDEO_ELEMENT_UPDATE
})

export const setVideoElement = () => ({
  type: SET_VIDEO_ELEMENT
})

export const unsetVideoElement = () => ({
  type: UNSET_VIDEO_ELEMENT
})

export const setVideoSrc = src => ({
  type: SET_VIDEO_SRC,
  payload: {
    src
  }
})

export const setVideoPaused = paused => ({
  type: SET_VIDEO_PAUSED,
  payload: {
    paused
  }
})

export const setVideoMuted = muted => ({
  type: SET_VIDEO_MUTED,
  payload: {
    muted
  }
})

export const setVideoProperties = properties => ({
  type: SET_VIDEO_PROPERTIES,
  payload: {
    properties
  }
})

export const videoPlayPromise = () => ({
  type: VIDEO_PLAY_PROMISE
})

export const videoPlayNoPromise = () => ({
  type: VIDEO_PLAY_NO_PROMISE
})

export const videoPlayPromiseFulfilled = () => ({
  type: VIDEO_PLAY_PROMISE_FULFILLED
})

export const videoPlayPromiseRejected = error => ({
  type: VIDEO_PLAY_PROMISE_REJECTED,
  payload: {
    error: errorToString(error)
  }
})

export const videoEvent = type => ({
  type: VIDEO_EVENT,
  payload: {
    type
  }
})
