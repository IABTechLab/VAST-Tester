import { connect } from 'react-redux'
import qs from 'qs'
import { setConfig } from '../actions'

const isBooleanConfigKey = key => key !== 'vastUrl'

const isValidConfig = config =>
  config != null &&
  typeof config.vastUrl === 'string' &&
  config.vastUrl.length > 0

const normalizeValidConfig = config =>
  Object.keys(config).reduce(
    (acc, key) => ({
      ...acc,
      [key]: isBooleanConfigKey(key)
        ? '' + config[key] === 'true'
        : '' + config[key]
    }),
    {}
  )

const normalizeConfig = config =>
  isValidConfig(config) ? normalizeValidConfig(config) : null

const ApplyConfig = ({ config, location, onConfigChange }) => {
  const newConfig = normalizeConfig(qs.parse(location.search.substr(1)))
  if (JSON.stringify(config) !== JSON.stringify(newConfig)) {
    onConfigChange(newConfig)
  }
  return null
}

const mapStateToProps = ({ config }) => ({ config })

const mapDispatchToProps = dispatch => ({
  onConfigChange: config => {
    dispatch(setConfig(config))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ApplyConfig)
