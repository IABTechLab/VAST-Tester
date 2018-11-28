import '../style/app.scss'
import React from 'react'
import { connect } from 'react-redux'
import { HashRouter, Switch, Route } from 'react-router-dom'
import Config from './Config'
import Runner from './Runner'
import Share from './Share'
import About from '../components/About'
import GoogleAnalytics from '../components/GoogleAnalytics'

const App = ({ config }) => (
  <HashRouter>
    <React.Fragment>
      <GoogleAnalytics />
      <Switch>
        <Route exact path='/' component={Config} />
        <Route exact path='/run' component={Runner} />
        <Route exact path='/share' component={Share} />
        <Route exact path='/about' component={About} />
      </Switch>
    </React.Fragment>
  </HashRouter>
)

const mapStateToProps = ({ config }) => ({ config })

export default connect(mapStateToProps)(App)
