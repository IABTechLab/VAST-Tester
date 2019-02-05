import { handleActions } from 'redux-actions'
import {
  START_TEST,
  VAST_LOADED,
  VERIFICATION_SCRIPT_LOADED,
  VERIFICATION_SCRIPT_LOAD_ERROR,
  START_VERIFICATION_SESSION,
  VERIFICATION_SCRIPT_SESSION_STARTED,
  VERIFICATION_SCRIPT_SESSION_START_ERROR,
  VERIFICATION_EVENT,
  SET_MEDIA_FILE,
  SET_VIDEO_PROPERTIES,
  SET_VPAID_PROPERTIES
} from '../actions'
import { OMID_EVENT_TYPES } from '../../common/constants/omid'
import mapObject from '../../common/util/mapObject'
import incrementCounter from '../../common/util/incrementCounter'

const updateArray = (array, idx, value) => {
  const copy = array.slice()
  copy[idx] = value
  return copy
}

const getVerificationIndex = (verification, { verifications }) =>
  verifications.indexOf(verification)

const defaultGlobalEventCounts = () => mapObject(OMID_EVENT_TYPES, 0)

const defaultState = () => ({
  verifications: [],
  scriptStatuses: [],
  globalEventCounts: defaultGlobalEventCounts(),
  scriptsLoaded: -1,
  scriptsFailed: -1,
  sessionsStarted: -1,
  sessionsFailed: -1,
  isVpaid: false,
  duration: NaN,
  videoPlayerVolume: NaN
})

const reducer = handleActions(
  {
    [START_TEST]: defaultState,
    [VAST_LOADED]: (state, { payload: { verifications } }) => ({
      ...state,
      verifications: verifications,
      scriptStatuses: verifications.map(() => 'loading'),
      scriptsLoaded: 0,
      scriptsFailed: 0
    }),
    [VERIFICATION_SCRIPT_LOADED]: (state, { payload: { verification } }) => {
      const idx = getVerificationIndex(verification, state)
      return {
        ...state,
        scriptStatuses: updateArray(state.scriptStatuses, idx, 'loaded'),
        scriptsLoaded: state.scriptsLoaded + 1
      }
    },
    [VERIFICATION_SCRIPT_LOAD_ERROR]: (
      state,
      { payload: { verification } }
    ) => {
      const idx = getVerificationIndex(verification, state)
      return {
        ...state,
        scriptStatuses: updateArray(state.scriptStatuses, idx, 'failed'),
        scriptsFailed: state.scriptsFailed + 1
      }
    },
    [START_VERIFICATION_SESSION]: state => {
      return {
        ...state,
        sessionsStarted: 0,
        sessionsFailed: 0
      }
    },
    [VERIFICATION_SCRIPT_SESSION_STARTED]: (
      state,
      { payload: { verification } }
    ) => {
      const idx = getVerificationIndex(verification, state)
      return {
        ...state,
        scriptStatuses: updateArray(state.scriptStatuses, idx, 'started'),
        sessionsStarted: state.sessionsStarted + 1
      }
    },
    [VERIFICATION_SCRIPT_SESSION_START_ERROR]: (
      state,
      { payload: { verification, error } }
    ) => {
      const idx = getVerificationIndex(verification, state)
      return {
        ...state,
        scriptStatuses: updateArray(state.scriptStatuses, idx, 'failed'),
        sessionsFailed: state.sessionsFailed + 1
      }
    },
    [VERIFICATION_EVENT]: (state, { payload: { type } }) => ({
      ...state,
      globalEventCounts: incrementCounter(state.globalEventCounts, type)
    }),
    [SET_MEDIA_FILE]: (state, { payload: { apiFramework } }) => ({
      ...state,
      isVpaid: apiFramework === 'VPAID'
    }),
    [SET_VIDEO_PROPERTIES]: (
      state,
      {
        payload: {
          properties: { duration, muted, volume }
        }
      }
    ) =>
      state.isVpaid
        ? state
        : {
          ...state,
          duration,
          videoPlayerVolume: muted ? 0 : volume
        },
    [SET_VPAID_PROPERTIES]: (
      state,
      {
        payload: {
          properties: { adDuration, adVolume }
        }
      }
    ) => ({
      ...state,
      duration: adDuration,
      videoPlayerVolume: adVolume
    })
  },
  defaultState()
)

export default reducer
