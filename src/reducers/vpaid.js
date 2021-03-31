import { handleActions } from 'redux-actions'

import {
  CALLING_VPAID_FUNCTION,
  SET_VPAID_PROPERTIES,
  START_TEST,
  VPAID_EVENT
} from '../actions'
import { VPAID_EVENT_NAMES, VPAID_PROPERTY_NAMES } from '../constants/vpaid'
import incrementCounter from '../util/incrementCounter'
import mapObject from '../util/mapObject'

const defaultEventCounts = () => mapObject(VPAID_EVENT_NAMES, 0)

const defaultProperties = () => mapObject(VPAID_PROPERTY_NAMES, '')

const defaultState = () => ({
  eventCounts: defaultEventCounts(),
  properties: defaultProperties(),
  status: ''
})

const operationToStatus = {
  initAd: 'loading',
  startAd: 'starting',
  stopAd: 'stopping'
}

const eventToStatus = {
  AdLoaded: 'loaded',
  AdStarted: 'started',
  AdStopped: 'stopped',
  AdError: 'error'
}

const reducer = handleActions(
  {
    [START_TEST]: defaultState,
    [SET_VPAID_PROPERTIES]: (state, { payload: { properties } }) => ({
      ...state,
      properties
    }),
    [CALLING_VPAID_FUNCTION]: (state, { payload: { name } }) => ({
      ...state,
      status: operationToStatus[name] || state.status
    }),
    [VPAID_EVENT]: (state, { payload: { name } }) => ({
      ...state,
      status: eventToStatus[name] || state.status,
      eventCounts: incrementCounter(state.eventCounts, name)
    })
  },
  defaultState()
)

export default reducer
