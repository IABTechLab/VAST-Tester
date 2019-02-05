import { connect } from 'react-redux'
import { setConfig } from '../actions'
import { parseConfig, configsEqual } from '../util/config'

const ApplyConfig = ({ location, config, onApplyConfig }) => {
  const newConfig = parseConfig(location.search.substr(1))
  if ((newConfig != null) & !configsEqual(config, newConfig)) {
    onApplyConfig(newConfig)
  }
  return null
}

const mapStateToProps = ({ config }) => ({ config })

const mapDispatchToProps = dispatch => ({
  onApplyConfig: config => {
    dispatch(setConfig(config))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplyConfig)
