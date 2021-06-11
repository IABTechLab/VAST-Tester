const { protocol, host } = window.location

export const APP_NAME = process.env.REACT_APP_NAME
export const APP_VENDOR = process.env.REACT_APP_VENDOR
export const APP_VERSION = process.env.REACT_APP_VERSION
export const APP_BRANCH = process.env.REACT_APP_BRANCH
export const APP_BUILD_DATE = process.env.REACT_APP_BUILD_DATE
export const APP_URL = `${protocol}//${host}`

export const DEFAULT_VAST_URL = `${APP_URL}/fixtures/vast/vast3.xml`

export const PRELOAD_SIMULATION_TIME = 5000
export const SCRIPT_LOAD_TIMEOUT = 30000
export const SESSION_START_TIMEOUT = 5000
export const VPAID_PROPERTIES_UPDATE_INTERVAL = 250
