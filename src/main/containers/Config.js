import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'
import Fieldset from '../components/Fieldset'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Checkbox from '../components/Checkbox'
import {
  createDefaultConfig,
  parseConfig,
  stringifyConfig
} from '../util/config'
import { setConfig } from '../actions'

class Config extends React.Component {
  constructor (props) {
    super(props)
    const { location, config, onResetConfig } = props
    if (config != null) {
      onResetConfig()
    }
    this.state = parseConfig(location.search.substr(1)) || createDefaultConfig()
  }

  render () {
    return (
      <main className='config'>
        <Header />
        <div className='contents'>
          <form
            onSubmit={event => {
              event.preventDefault()
              this._runButton.click()
            }}
          >
            <Fieldset legend='VAST URL'>
              <TextInput
                defaultValue={this.state.vastUrl}
                onChange={this._onChange('vastUrl')}
              />
            </Fieldset>
            <Fieldset legend='Video Player Behavior'>
              <Checkbox
                label='Enable audio by default'
                defaultValue={this.state.audioUnmuted}
                onChange={this._onChange('audioUnmuted')}
              />
              <Checkbox
                label='Simulate creative preloading'
                defaultValue={this.state.startDelayed}
                onChange={this._onChange('startDelayed')}
              />
            </Fieldset>
            <Fieldset legend='Media File Selection'>
              <Checkbox
                label='Allow VPAID media files'
                defaultValue={this.state.vpaidEnabled}
                onChange={this._onChange('vpaidEnabled')}
              />
            </Fieldset>
            <Fieldset legend='OMID Verification'>
              <Checkbox
                label='Delay playback until verification start'
                defaultValue={this.state.verificationSessionRequired}
                onChange={this._onChange('verificationSessionRequired')}
              />
              <Checkbox
                label='Run verification scripts in limited-access mode'
                defaultValue={this.state.verificationLimitedAccessMode}
                onChange={this._onChange('verificationLimitedAccessMode')}
              />
            </Fieldset>
          </form>
        </div>
        <div className='actions'>
          <nav>
            <ul>
              <li>
                <Link
                  to={{ pathname: '/run', search: stringifyConfig(this.state) }}
                  onClick={this.props.onRun}
                  innerRef={ref => {
                    this._runButton = ref
                  }}
                >
                  Run Test <FontAwesome name='arrow-right' />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </main>
    )
  }

  _onChange (key) {
    return value => {
      this.setState({
        ...this.state,
        [key]: value
      })
    }
  }
}

const mapStateToProps = ({ config }) => ({ config })

const mapDispatchToProps = dispatch => ({
  onResetConfig: () => {
    dispatch(setConfig(null))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Config)
