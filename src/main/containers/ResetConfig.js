import { connect } from 'react-redux'
import { setConfig } from '../actions'

const ResetConfig = ({ config, onConfigReset }) => {
  if (config != null) {
    onConfigReset()
  }
  return null
}

const mapStateToProps = ({ config }) => ({ config })

const mapDispatchToProps = dispatch => ({
  onConfigReset: () => {
    dispatch(setConfig(null))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetConfig)
