import React from 'react'
import { connect } from 'react-redux'
import { setConfig } from '../actions'
import { parseConfig, configsEqual } from '../util/config'

class ApplyConfig extends React.Component {
  componentDidMount () {
    const { location, config, onApplyConfig } = this.props
    const newConfig = parseConfig(location.search.substr(1))
    if ((newConfig != null) & !configsEqual(config, newConfig)) {
      onApplyConfig(newConfig)
    }
  }

  render () {
    return null
  }
}

const mapStateToProps = ({ config }) => ({ config })

const mapDispatchToProps = dispatch => ({
  onApplyConfig: config => {
    dispatch(setConfig(config))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ApplyConfig)
