import qs from 'qs'

import { DEFAULT_VAST_URL } from './settings'

const ConfigSchema = {
  vastUrl: { type: 'string', default: DEFAULT_VAST_URL },
  audioUnmuted: { type: 'boolean', default: false },
  startDelayed: { type: 'boolean', default: false },
  vpaidEnabled: { type: 'boolean', default: true },
  vpaidPropertiesAllowedBeforeAdLoaded: { type: 'boolean', default: true },
  omAccessMode: { type: 'string', default: 'full' }
}

const isUnset = value => value == null || value === false || value === ''

const isBooleanKey = key =>
  ConfigSchema[key] != null && ConfigSchema[key].type === 'boolean'

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

const createDefaultConfig = () =>
  Object.entries(ConfigSchema).reduce(
    (acc, [key, { default: value }]) => ({ ...acc, [key]: value }),
    {}
  )

const parseConfig = str => (str === '' ? null : normalize(qs.parse(str)))

const stringifyConfig = config =>
  config == null ? '' : qs.stringify(normalize(config))

const configsEqual = (a, b) => stringifyConfig(a) === stringifyConfig(b)

export {
  ConfigSchema,
  configsEqual,
  createDefaultConfig,
  parseConfig,
  stringifyConfig
}
