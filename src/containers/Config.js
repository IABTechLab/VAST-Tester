import React from 'react'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { setConfig } from '../actions'
import Checkbox from '../components/Checkbox'
import Fieldset from '../components/Fieldset'
import Header from '../components/Header'
import Switch from '../components/Switch'
import TextInput from '../components/TextInput'
import { createDefaultConfig, parseConfig, stringifyConfig } from '../config'
import { PRELOAD_SIMULATION_TIME } from '../settings'
import msToString from '../util/msToString'

const { atob, btoa } = window

const ACCESS_MODES = {
  limited: 'Limited',
  creative: 'Creative',
  full: 'Full'
}

const reBase64DataUri = /^data:[^,;]+;base64,(.*)/

const fromDataUri = uri => {
  const match = reBase64DataUri.exec(uri)
  if (match != null) {
    try {
      uri = atob(match[1])
    } catch (_) {}
  }
  return uri
}

const toDataUri = value =>
  value.trim().charAt(0) === '<' ? 'data:text/xml;base64,' + btoa(value) : value

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
      <main className="config">
        <Header />
        <div className="contents">
          <form
            onSubmit={event => {
              event.preventDefault()
              this._runButton.click()
            }}
          >
            <Fieldset legend="VAST (URL or XML)">
              <TextInput
                defaultValue={fromDataUri(this.state.vastUrl)}
                onChange={this._onVastUrlChange.bind(this)}
              />
            </Fieldset>
            <Fieldset legend="Video Player Behavior">
              <Checkbox
                label="Unmute audio by default"
                tooltip="Allows the ad to play audio without user interaction"
                defaultValue={this.state.audioUnmuted}
                onChange={this._onChange('audioUnmuted')}
              />
              <Checkbox
                label="Simulate creative preloading"
                tooltip={
                  'Delays the start of the ad by ' +
                  msToString(PRELOAD_SIMULATION_TIME) +
                  ' (useful to diagnose premature events)'
                }
                defaultValue={this.state.startDelayed}
                onChange={this._onChange('startDelayed')}
              />
            </Fieldset>
            <Fieldset legend="VPAID Creative">
              <Checkbox
                label="Allow VPAID media files"
                tooltip="Prefers interactive media files over standard video if available"
                defaultValue={this.state.vpaidEnabled}
                onChange={this._onChange('vpaidEnabled')}
              />
              <Checkbox
                label="Populate VPAID properties before AdLoaded event"
                tooltip="Aggressively requests metadata from VPAID units (incompatible with some ads)"
                defaultValue={this.state.vpaidPropertiesAllowedBeforeAdLoaded}
                onChange={this._onChange(
                  'vpaidPropertiesAllowedBeforeAdLoaded'
                )}
              />
            </Fieldset>
            <Fieldset legend="Open Measurement">
              <Switch
                label="Verification access mode"
                tooltip="Determines access permissions for verification scripts"
                options={ACCESS_MODES}
                defaultValue={this.state.omAccessMode}
                onChange={this._onChange('omAccessMode')}
              />
            </Fieldset>
          </form>
        </div>
        <div className="actions">
          <nav>
            <ul>
              <li>
                <Link
                  to={{ pathname: '/run', search: stringifyConfig(this.state) }}
                  innerRef={ref => {
                    this._runButton = ref
                  }}
                >
                  Run Test <FontAwesome name="arrow-right" />
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

  _onVastUrlChange (value) {
    this.setState({
      ...this.state,
      vastUrl: toDataUri(value)
    })
  }
}

const mapStateToProps = ({ config }) => ({ config })

const mapDispatchToProps = dispatch => ({
  onResetConfig: () => {
    dispatch(setConfig(null))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Config)
