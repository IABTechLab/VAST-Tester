import {
  CALLING_VPAID_FUNCTION,
  FINISH_VERIFICATION_SESSION,
  LOAD_VAST,
  LOAD_VERIFICATION_HOST,
  LOAD_VPAID,
  REQUEST_AD_SKIP,
  SCHEDULE_AD_START,
  SET_CONFIG,
  SET_MEDIA_FILE,
  SET_VIDEO_MUTED,
  SET_VIDEO_PAUSED,
  START_AD,
  START_TEST,
  START_VERIFICATION_SESSION,
  UNSUPPORTED_MEDIA_FILES,
  VAST_EVENT,
  VAST_LOAD_FAILED,
  VAST_LOADED,
  VAST_WARNING,
  VERIFICATION_EVENT,
  VERIFICATION_SCRIPT_LOAD_ERROR,
  VERIFICATION_SCRIPT_LOADED,
  VERIFICATION_SCRIPT_REGISTERING_SESSION_OBSERVER,
  VERIFICATION_SCRIPT_SESSION_START_ERROR,
  VERIFICATION_SCRIPT_SESSION_STARTED,
  VERIFICATION_SCRIPTS_STARTED,
  VIDEO_EVENT,
  VIDEO_PLAY_NO_PROMISE,
  VIDEO_PLAY_PROMISE_FULFILLED,
  VIDEO_PLAY_PROMISE_REJECTED,
  VIDEO_PLAY_PROMISE,
  VPAID_ERROR,
  VPAID_EVENT,
  VPAID_HANDSHAKE_SUCCESSFUL,
  VPAID_LOAD_FAILED,
  VPAID_LOADED,
  VPAID_WARNING
} from '../actions'
import { PRELOAD_SIMULATION_TIME } from '../../common/settings'
import msToString from '../../common/util/msToString'
import isEmpty from '../../common/util/isEmpty'

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
const OMID = 'OMID'
const VIDEO = 'video'

const LEFT_QUOTE = String.fromCharCode(0x201c)
const RIGHT_QUOTE = String.fromCharCode(0x201d)

const quote = str => LEFT_QUOTE + str + RIGHT_QUOTE

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
  [SCHEDULE_AD_START]: ({ delayed, verificationSessionStarted }) => ({
    category: VAST,
    text:
      (verificationSessionStarted
        ? 'Verification session started'
        : 'Not waiting for verification scripts') +
      ', ' +
      (delayed
        ? `simulating preloading for ${msToString(PRELOAD_SIMULATION_TIME)}`
        : 'starting ad')
  }),
  [START_AD]: ({ delayed, verificationSessionStarted }) =>
    delayed || verificationSessionStarted
      ? {
        category: VAST,
        text:
            'Starting ad' +
            (verificationSessionStarted
              ? ' after verification session start' + (delayed ? ' and' : '')
              : '') +
            (delayed ? ' after simulated preloading' : '')
      }
      : null,
  [REQUEST_AD_SKIP]: {
    category: VAST,
    text: 'Ad skip requested'
  },
  [LOAD_VERIFICATION_HOST]: ({ verification }) => ({
    category: OMID,
    text: `Loading script from ${quote(verification.vendor)}: ${
      verification.uri
    }`
  }),
  [VERIFICATION_SCRIPT_LOADED]: ({ verification }) => ({
    category: OMID,
    text: `Loaded script from ${quote(verification.vendor)}`
  }),
  [VERIFICATION_SCRIPT_LOAD_ERROR]: ({ verification, error }) => ({
    category: OMID,
    text: `Failed to load script from ${quote(verification.vendor)}: ${error}`,
    level: ERROR
  }),
  [START_VERIFICATION_SESSION]: {
    category: OMID,
    text: 'Starting session'
  },
  [VERIFICATION_SCRIPT_REGISTERING_SESSION_OBSERVER]: ({
    verification,
    vendorKey
  }) => ({
    category: OMID,
    text: `Script from ${quote(
      verification.vendor
    )} registered session observer with vendor key ${quote(vendorKey)}`
  }),
  [VERIFICATION_SCRIPT_SESSION_STARTED]: ({ verification }) => ({
    category: OMID,
    text: `Started session for script from ${quote(verification.vendor)}`
  }),
  [VERIFICATION_SCRIPT_SESSION_START_ERROR]: ({ verification, error }) => ({
    category: OMID,
    text: `Failed to start session for ${verification.vendor}: ${error}`,
    level: ERROR
  }),
  [VERIFICATION_SCRIPTS_STARTED]: ({ scriptCount, sessionFinished }) => ({
    category: OMID,
    text:
      `Started ${scriptCount} script(s)` +
      (sessionFinished ? ' after session finished' : '')
  }),
  [VERIFICATION_EVENT]: ({ type, data }) => ({
    category: OMID,
    text: `Event: ${type}`,
    metadata: isEmpty(data) ? null : { Data: data }
  }),
  [FINISH_VERIFICATION_SESSION]: ({ error }) => ({
    category: OMID,
    text: 'Finishing session',
    metadata: error != null ? { Error: error } : null
  }),
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
