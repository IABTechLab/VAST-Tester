import { handleActions } from 'redux-actions'

import { SET_CONFIG } from '../actions'

const defaultState = () => null

const reducer = handleActions(
  {
    [SET_CONFIG]: (state, { payload }) => payload
  },
  defaultState()
)

export default reducer
