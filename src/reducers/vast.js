import { handleActions } from 'redux-actions'

import { SET_MEDIA_FILE, START_TEST, VAST_EVENT, VAST_LOADED } from '../actions'
import { VAST_EVENT_TYPES } from '../constants/vast'
import incrementCounter from '../util/incrementCounter'
import mapObject from '../util/mapObject'

const defaultState = () => ({
  chain: null,
  inLine: null,
  linear: null,
  trackingEvents: null,
  mediaFile: null,
  verifications: null,
  eventCounts: mapObject(VAST_EVENT_TYPES, 0)
})

const reducer = handleActions(
  {
    [START_TEST]: defaultState,
    [VAST_LOADED]: (
      state,
      { payload: { chain, inLine, linear, trackingEvents, verifications } }
    ) => ({
      ...state,
      chain,
      inLine,
      linear,
      trackingEvents,
      verifications
    }),
    [SET_MEDIA_FILE]: (
      state,
      { payload: { url, apiFramework, adParameters } }
    ) => ({
      ...state,
      mediaFile: {
        url,
        apiFramework
      },
      adParameters
    }),
    [VAST_EVENT]: (state, { payload: { type } }) => ({
      ...state,
      eventCounts: incrementCounter(state.eventCounts, type)
    })
  },
  defaultState()
)

export default reducer
