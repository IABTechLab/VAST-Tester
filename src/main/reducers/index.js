import { combineReducers } from 'redux'
import config from './config'
import ad from './ad'
import vast from './vast'
import video from './video'
import vpaid from './vpaid'
import verification from './verification'
import log from './log'

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
