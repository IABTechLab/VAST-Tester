import { handleActions } from 'redux-actions'
import {
  START_TEST,
  SET_MEDIA_FILE,
  SET_VIDEO_SRC,
  SET_VIDEO_PAUSED,
  SET_VIDEO_MUTED,
  SET_VIDEO_PROPERTIES,
  VIDEO_EVENT
} from '../actions'
import {
  VIDEO_EVENT_TYPES,
  VIDEO_PROPERTY_NAMES
} from '../../common/constants/video'
import mapObject from '../../common/util/mapObject'
import incrementCounter from '../../common/util/incrementCounter'

const defaultEventCounts = () => mapObject(VIDEO_EVENT_TYPES, 0)

const defaultProperties = () => mapObject(VIDEO_PROPERTY_NAMES, '')

const defaultState = () => ({
  eventCounts: defaultEventCounts(),
  properties: defaultProperties(),
  shared: false,
  src: null,
  muted: false,
  paused: true
})

const reducer = handleActions(
  {
    [START_TEST]: defaultState,
    [SET_MEDIA_FILE]: (state, { payload: { apiFramework } }) => {
      const isVpaid = apiFramework != null
      return {
        ...state,
        shared: isVpaid
      }
    },
    [SET_VIDEO_PAUSED]: (state, { payload: { paused } }) => ({
      ...state,
      paused
    }),
    [SET_VIDEO_SRC]: (state, { payload: { src } }) => ({
      ...state,
      src
    }),
    [SET_VIDEO_MUTED]: (state, { payload: { muted } }) => ({
      ...state,
      muted
    }),
    [SET_VIDEO_PROPERTIES]: (state, { payload: { properties } }) => ({
      ...state,
      properties
    }),
    [VIDEO_EVENT]: (state, { payload: { type } }) => ({
      ...state,
      eventCounts: incrementCounter(state.eventCounts, type)
    })
  },
  defaultState()
)

export default reducer
