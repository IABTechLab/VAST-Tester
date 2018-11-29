import qs from 'qs'
import { DEFAULT_VAST_URL } from '../../common/settings'

const isUnset = value => value == null || value === false || value === ''

const isBooleanKey = key => key !== 'vastUrl'

const normalize = config =>
  Object.entries(config).reduce(
    (acc, [key, value]) =>
      isUnset(value)
        ? acc
        : {
          ...acc,
          [key]: isBooleanKey(key) ? '' + value === 'true' : '' + value
        },
    {}
  )

export const createDefaultConfig = () => ({
  vastUrl: DEFAULT_VAST_URL,
  audioUnmuted: false,
  startDelayed: false,
  vpaidEnabled: true,
  verificationSessionRequired: false,
  verificationLimitedAccessMode: false
})

export const parseConfig = str => (str === '' ? null : normalize(qs.parse(str)))

export const stringifyConfig = config =>
  config == null ? '' : qs.stringify(normalize(config))

export const configsEqual = (a, b) => stringifyConfig(a) === stringifyConfig(b)
