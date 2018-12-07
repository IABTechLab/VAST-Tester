const { protocol, host } = window.location

const isDev = process.env.NODE_ENV === 'development'
const port = isDev ? process.env.PORT || 3000 : null

const S3_REGION = 'us-west-2'
const PUBLIC_HOST_1 = 'vasttester.iabtechlab.com'
const PUBLIC_HOST_2 = 'vasttester2.iabtechlab.com'
const DEV_HOST_1 = `localhost:${port}`
const DEV_HOST_2 = `127.0.0.1:${port}`

let altHost
if (isDev) {
  altHost = host === DEV_HOST_2 ? DEV_HOST_1 : DEV_HOST_2
} else {
  if (host === PUBLIC_HOST_2) {
    altHost = PUBLIC_HOST_1
  } else {
    const match = /^vasttester-(?:origin-)?(\w+)\.iabtechlab\.com(\.s3[^.]*\.amazonaws\.com)?$/.exec(
      host
    )
    if (match != null) {
      const [, branch, s3] = match
      const suffix = s3 == null ? `.s3-website-${S3_REGION}.amazonaws.com` : ''
      altHost = `vasttester-origin-${branch}.iabtechlab.com` + suffix
    } else {
      altHost = PUBLIC_HOST_2
    }
  }
}

export const APP_NAME = process.env.REACT_APP_NAME
export const APP_VENDOR = process.env.REACT_APP_VENDOR
export const APP_VERSION = process.env.REACT_APP_VERSION
export const APP_BUILD_DATE = process.env.REACT_APP_BUILD_DATE
export const APP_URL = `${protocol}//${host}`
export const APP_URL_ALT = `${protocol}//${altHost}`

export const DEFAULT_VAST_URL = `${APP_URL}/fixtures/vast/vast3.xml`

export const PRELOAD_SIMULATION_TIME = 5000
export const SCRIPT_LOAD_TIMEOUT = 30000
export const SESSION_START_TIMEOUT = 5000
export const VPAID_PROPERTIES_UPDATE_INTERVAL = 250
