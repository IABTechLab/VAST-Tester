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

export const scheduleAdStart = delayed => ({
  type: SCHEDULE_AD_START,
  payload: {
    delayed
  }
})

export const startAd = delayed => ({
  type: START_AD,
  payload: {
    delayed
  }
})

export const requestAdMuted = muted => ({
  type: REQUEST_AD_MUTED,
  payload: {
    muted
  }
})

export const requestAdFullscreen = fullscreen => ({
  type: REQUEST_AD_FULLSCREEN,
  payload: {
    fullscreen
  }
})

export const requestAdPaused = paused => ({
  type: REQUEST_AD_PAUSED,
  payload: {
    paused
  }
})

export const requestAdSkip = () => ({
  type: REQUEST_AD_SKIP
})

export const setAdActive = active => ({
  type: SET_AD_ACTIVE,
  payload: {
    active
  }
})

export const setAdMuted = muted => ({
  type: SET_AD_MUTED,
  payload: {
    muted
  }
})

export const setAdFullscreen = fullscreen => ({
  type: SET_AD_FULLSCREEN,
  payload: {
    fullscreen
  }
})

export const setAdPaused = paused => ({
  type: SET_AD_PAUSED,
  payload: {
    paused
  }
})

export const adBufferStart = () => ({
  type: AD_BUFFER_START
})

export const adBufferFinish = () => ({
  type: AD_BUFFER_FINISH
})

export const adVolumeChange = () => ({
  type: AD_VOLUME_CHANGE
})

export const adStopped = (errorType = null, message = null) => ({
  type: AD_STOPPED,
  payload:
    errorType == null
      ? null
      : {
          errorType,
          message
        }
})
