import { homepage, homepageAlt } from '../../package.json'

const isDev = process.env.NODE_ENV === 'development'
const port = isDev ? process.env.PORT || 3000 : null

export const APP_NAME = process.env.REACT_APP_NAME
export const APP_VENDOR = process.env.REACT_APP_VENDOR
export const APP_VERSION = process.env.REACT_APP_VERSION
export const APP_BUILD_DATE = process.env.REACT_APP_BUILD_DATE
export const APP_URL_1 = isDev ? `//localhost:${port}` : homepage
export const APP_URL_2 = isDev ? `//127.0.0.1:${port}` : homepageAlt

export const DEFAULT_VAST_URL =
  window.location.protocol + `//${window.location.host}/fixtures/vast/vast3.xml`

export const PRELOAD_SIMULATION_TIME = 5000
export const SCRIPT_LOAD_TIMEOUT = 30000
export const SESSION_START_TIMEOUT = 5000
export const VPAID_PROPERTIES_UPDATE_INTERVAL = 250
