import { combineReducers } from 'redux'

import ad from './ad'
import config from './config'
import log from './log'
import vast from './vast'
import verification from './verification'
import video from './video'
import vpaid from './vpaid'

const reducer = combineReducers({
  config,
  vast,
  ad,
  video,
  vpaid,
  verification,
  log
})

export default reducer
