import createAction from '../util/createAction'

export const SCHEDULE_AD_START = 'SCHEDULE_AD_START'
export const START_AD = 'START_AD'
export const REQUEST_AD_MUTED = 'REQUEST_AD_MUTED'
export const REQUEST_AD_PAUSED = 'REQUEST_AD_PAUSED'
export const REQUEST_AD_FULLSCREEN = 'REQUEST_AD_FULLSCREEN'
export const REQUEST_AD_SKIP = 'REQUEST_AD_SKIP'
export const SET_AD_ACTIVE = 'SET_AD_ACTIVE'
export const SET_AD_PAUSED = 'SET_AD_PAUSED'
export const SET_AD_MUTED = 'SET_AD_MUTED'
export const SET_AD_FULLSCREEN = 'SET_AD_FULLSCREEN'
export const AD_BUFFER_START = 'AD_BUFFER_START'
export const AD_BUFFER_FINISH = 'AD_BUFFER_FINISH'
export const AD_VOLUME_CHANGE = 'AD_VOLUME_CHANGE'
export const AD_STOPPED = 'AD_STOPPED'

export const scheduleAdStart = delayed =>
  createAction(SCHEDULE_AD_START, {
    delayed
  })

export const startAd = delayed =>
  createAction(START_AD, {
    delayed
  })

export const requestAdMuted = muted =>
  createAction(REQUEST_AD_MUTED, {
    muted
  })

export const requestAdFullscreen = fullscreen =>
  createAction(REQUEST_AD_FULLSCREEN, {
    fullscreen
  })

export const requestAdPaused = paused =>
  createAction(REQUEST_AD_PAUSED, {
    paused
  })

export const requestAdSkip = () => createAction(REQUEST_AD_SKIP)

export const setAdActive = active =>
  createAction(SET_AD_ACTIVE, {
    active
  })

export const setAdMuted = muted =>
  createAction(SET_AD_MUTED, {
    muted
  })

export const setAdFullscreen = fullscreen =>
  createAction(SET_AD_FULLSCREEN, {
    fullscreen
  })

export const setAdPaused = paused =>
  createAction(SET_AD_PAUSED, {
    paused
  })

export const adBufferStart = () => createAction(AD_BUFFER_START)

export const adBufferFinish = () => createAction(AD_BUFFER_FINISH)

export const adVolumeChange = () => createAction(AD_VOLUME_CHANGE)

export const adStopped = (errorType = null, message = null) =>
  createAction(
    AD_STOPPED,
    errorType == null
      ? null
      : {
          errorType,
          message
        }
  )
