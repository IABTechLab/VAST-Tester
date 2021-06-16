import adEpic from './ad'
import configEpic from './config'
import testEpic from './test'
import vastTrackingEpic from './tracking'
import vastEpic from './vast'
import verificationEpic from './verification'
import videoEpic from './video'
import vpaidEpic from './vpaid'

export default [
  configEpic,
  testEpic,
  adEpic,
  vastEpic,
  vastTrackingEpic,
  verificationEpic,
  videoEpic,
  vpaidEpic
]
