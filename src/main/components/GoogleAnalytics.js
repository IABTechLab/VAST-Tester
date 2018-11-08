import React from 'react'
import ReactGA from 'react-ga'
import { withRouter } from 'react-router'
import { GOOGLE_ANALYTICS_PROPERTY_ID } from '../../common/settings'

const toUrl = loc => loc.pathname + loc.search

class GoogleAnalytics extends React.Component {
  constructor (props) {
    super(props)
    this._initDone = false
  }

  componentDidMount () {
    this._track(toUrl(this.props.location))
  }

  componentDidUpdate (prevProps) {
    const prev = toUrl(prevProps.location)
    const curr = toUrl(this.props.location)
    if (prev !== curr) {
      this._track(curr)
    }
  }

  render () {
    return null
  }

  _track (page) {
    if (GOOGLE_ANALYTICS_PROPERTY_ID == null) {
      return
    }
    if (!this._initDone) {
      ReactGA.initialize(GOOGLE_ANALYTICS_PROPERTY_ID)
      this._initDone = true
    }
    ReactGA.set({ page })
    ReactGA.pageview(page)
  }
}

export default withRouter(GoogleAnalytics)
