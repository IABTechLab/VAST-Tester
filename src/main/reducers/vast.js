import { handleActions } from 'redux-actions'
import { START_TEST, VAST_LOADED, SET_MEDIA_FILE, VAST_EVENT } from '../actions'
import { VAST_EVENT_TYPES } from '../../common/constants/vast'
import mapObject from '../../common/util/mapObject'
import incrementCounter from '../../common/util/incrementCounter'

const defaultState = () => ({
  chain: null,
  inLine: null,
  linear: null,
  mediaFile: null,
  eventCounts: mapObject(VAST_EVENT_TYPES, 0)
})

const reducer = handleActions(
  {
    [START_TEST]: defaultState,
    [VAST_LOADED]: (state, { payload: { chain, inLine, linear } }) => ({
      ...state,
      chain,
      inLine,
      linear
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
