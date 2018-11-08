import { handleActions } from 'redux-actions'
import {
  START_TEST,
  SET_AD_ACTIVE,
  SET_AD_MUTED,
  SET_AD_PAUSED
} from '../actions'

const defaultState = () => ({
  active: false,
  paused: true,
  muted: false
})

const reducer = handleActions(
  {
    [START_TEST]: defaultState,
    [SET_AD_ACTIVE]: (state, { payload: { active } }) => ({
      ...state,
      active
    }),
    [SET_AD_MUTED]: (state, { payload: { muted } }) => ({
      ...state,
      muted
    }),
    [SET_AD_PAUSED]: (state, { payload: { paused } }) => ({
      ...state,
      paused
    })
  },
  defaultState()
)

export default reducer
