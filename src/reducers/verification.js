import { handleActions } from 'redux-actions'

import { START_TEST, VAST_LOADED, VERIFICATION_EVENT } from '../actions'
import { VERIFICATION_EVENT_TYPES } from '../constants/verification'
import incrementCounter from '../util/incrementCounter'
import mapObject from '../util/mapObject'

const defaultState = () => ({
  accessMode: null,
  scripts: null,
  eventCounts: mapObject(VERIFICATION_EVENT_TYPES, 0)
})

const reducer = handleActions(
  {
    [START_TEST]: (state, { payload: { omAccessMode } }) => ({
      ...defaultState(),
      accessMode: omAccessMode
    }),
    [VAST_LOADED]: (state, { payload: { verifications } }) => ({
      ...state,
      scripts: verifications
    }),
    [VERIFICATION_EVENT]: (state, { payload: { type } }) => ({
      ...state,
      eventCounts: incrementCounter(state.eventCounts, type)
    })
  },
  defaultState()
)

export default reducer
