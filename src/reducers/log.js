import {
  CALLING_VPAID_FUNCTION,
  LOAD_VAST,
  LOAD_VPAID,
  REQUEST_AD_SKIP,
  SCHEDULE_AD_START,
  SET_CONFIG,
  SET_MEDIA_FILE,
  SET_VIDEO_MUTED,
  SET_VIDEO_PAUSED,
  START_AD,
  START_TEST,
  UNSUPPORTED_MEDIA_FILES,
  VAST_EVENT,
  VAST_LOAD_FAILED,
  VAST_LOADED,
  VAST_WARNING,
  VERIFICATION_ERROR_EVENT,
  VERIFICATION_EVENT,
  VERIFICATION_READY,
  VERIFICATION_SESSION_FINISHED,
  VIDEO_EVENT,
  VIDEO_PLAY_NO_PROMISE,
  VIDEO_PLAY_PROMISE,
  VIDEO_PLAY_PROMISE_FULFILLED,
  VIDEO_PLAY_PROMISE_REJECTED,
  VPAID_ERROR,
  VPAID_EVENT,
  VPAID_HANDSHAKE_SUCCESSFUL,
  VPAID_LOAD_FAILED,
  VPAID_LOADED,
  VPAID_WARNING
} from '../actions'
import { PRELOAD_SIMULATION_TIME } from '../settings'
import isEmpty from '../util/isEmpty'
import msToString from '../util/msToString'

const LOGGED_VIDEO_EVENTS = [
  'loadedmetadata',
  'loadeddata',
  'canplay',
  'canplaythrough',
  'waiting',
  'play',
  'playing',
  'pause',
  'ended',
  'volumechange',
  'error'
]

const INFO = 'info'
const WARN = 'warn'
const ERROR = 'error'

const VAST = 'VAST'
const VPAID = 'VPAID'
const VIDEO = 'video'
const OMID = 'OMID'

const HANDLERS = {
  [VAST_WARNING]: ({ message, url }) => ({
    category: VAST,
    text: `Tag ${url} warning: ${message}`,
    level: WARN
  }),
  [LOAD_VAST]: {
    category: VAST,
    text: 'Loading tag'
  },
  [VAST_LOADED]: {
    category: VAST,
    text: 'Tag loaded'
  },
  [VAST_LOAD_FAILED]: ({ error }) => ({
    category: VAST,
    text: `Failed to load tag: ${error}`,
    level: ERROR
  }),
  [UNSUPPORTED_MEDIA_FILES]: {
    category: VAST,
    text: 'No supported media files found'
  },
  [VAST_EVENT]: ({ type }) => ({
    category: VAST,
    text: `Event: ${type}`
  }),
  [SET_MEDIA_FILE]: ({ url, apiFramework }) => ({
    category: apiFramework != null ? VPAID : VIDEO,
    text: url == null ? 'Unloading media' : `Loading: ${url}`
  }),
  [SCHEDULE_AD_START]: ({ delayed }) => ({
    category: VAST,
    text: delayed
      ? `Simulating preloading for ${msToString(PRELOAD_SIMULATION_TIME)}`
      : 'Starting ad'
  }),
  [START_AD]: ({ delayed }) =>
    delayed
      ? {
          category: VAST,
          text: 'Starting ad' + (delayed ? ' after simulated preloading' : '')
        }
      : null,
  [REQUEST_AD_SKIP]: {
    category: VAST,
    text: 'Ad skip requested'
  },
  [VIDEO_EVENT]: ({ type }) =>
    LOGGED_VIDEO_EVENTS.includes(type)
      ? {
          category: VIDEO,
          text: `Event: ${type}`
        }
      : null,
  [SET_VIDEO_PAUSED]: ({ paused }) => ({
    category: VIDEO,
    text: paused ? 'Pausing' : 'Playing'
  }),
  [SET_VIDEO_MUTED]: ({ muted }) => ({
    category: VIDEO,
    text: muted ? 'Muting' : 'Unmuting'
  }),
  [VIDEO_PLAY_NO_PROMISE]: {
    category: VIDEO,
    text: 'Call to play() did not return promise'
  },
  [VIDEO_PLAY_PROMISE]: {
    category: VIDEO,
    text: 'Call to play() returned promise'
  },
  [VIDEO_PLAY_PROMISE_FULFILLED]: {
    category: VIDEO,
    text: 'Promise from play() call fulfilled'
  },
  [VIDEO_PLAY_PROMISE_REJECTED]: ({ error }) => ({
    category: VIDEO,
    text: `Promise from play() call rejected: ${error}`
  }),
  [LOAD_VPAID]: ({ url }) => ({
    category: VPAID,
    text: `Loading script: ${url}`
  }),
  [VPAID_LOADED]: {
    category: VPAID,
    text: 'Script loaded'
  },
  [VPAID_LOAD_FAILED]: ({ error }) => ({
    category: VPAID,
    text: `Failed to load script: ${error}`,
    level: ERROR
  }),
  [VPAID_HANDSHAKE_SUCCESSFUL]: ({ response }) => ({
    category: VPAID,
    text: `Handshake successful: got version ${response}`
  }),
  [CALLING_VPAID_FUNCTION]: ({ name, args }) =>
    name.startsWith('get')
      ? null
      : {
          category: VPAID,
          text: `Calling function ${name}`,
          metadata: isEmpty(args) ? null : { Args: args }
        },
  [VPAID_EVENT]: ({ name, data }) =>
    name === 'AdRemainingTimeChange'
      ? null
      : {
          category: VPAID,
          text: `Event: ${name}`,
          metadata: isEmpty(data) ? null : { Data: data }
        },
  [VPAID_WARNING]: ({ message }) => ({
    category: VPAID,
    text: message,
    level: WARN
  }),
  [VPAID_ERROR]: ({ message, cause }) => ({
    category: VPAID,
    text: message,
    level: ERROR,
    metadata: cause == null ? null : { Cause: cause }
  }),
  [VERIFICATION_READY]: ({ enabled }) =>
    enabled
      ? {
          category: OMID,
          text: 'Session started'
        }
      : null,
  [VERIFICATION_SESSION_FINISHED]: {
    category: OMID,
    text: 'Session finished'
  },
  [VERIFICATION_EVENT]: ({ type }) => ({
    category: OMID,
    text: `Event: ${type}`
  }),
  [VERIFICATION_ERROR_EVENT]: ({ errorType, message }) => ({
    category: OMID,
    text: `${message} (type: ${errorType})`,
    level: ERROR
  })
}

const defaultState = () => ({
  consoleEnabled: false,
  events: []
})

const reducer = (state = defaultState(), { type, payload }) => {
  if (type === START_TEST) {
    return {
      ...state,
      events: []
    }
  }
  if (type === SET_CONFIG) {
    if (payload == null) {
      return state
    }
    return {
      ...state,
      consoleEnabled: payload.consoleEnabled
    }
  }
  if (Object.prototype.hasOwnProperty.call(HANDLERS, type)) {
    const handler = HANDLERS[type]
    const result = typeof handler === 'function' ? handler(payload) : handler
    if (result != null) {
      const { category, level = INFO, text, metadata } = result
      if (state.consoleEnabled && typeof console[level] === 'function') {
        console[level](
          `[${category}] ${text}` +
            (metadata != null ? '\nData: ' + JSON.stringify(metadata) : '')
        )
      }
      return {
        ...state,
        events: [
          ...state.events,
          {
            timestamp: Date.now(),
            category,
            level,
            text,
            metadata
          }
        ]
      }
    }
  }
  return state
}

export default reducer
