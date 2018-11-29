import '../style/app.scss'
import React from 'react'
import { connect } from 'react-redux'
import { HashRouter, Switch, Route } from 'react-router-dom'
import About from '../components/About'
import ApplyConfig from './ApplyConfig'
import Config from './Config'
import Runner from './Runner'
import Share from './Share'

const App = ({ config }) => (
  <HashRouter>
    <React.Fragment>
      <Runner />
      <Switch>
        <Route exact path='/' component={Config} />
        <Route exact path='/run' component={ApplyConfig} />
        <Route exact path='/share' component={Share} />
        <Route exact path='/about' component={About} />
      </Switch>
    </React.Fragment>
  </HashRouter>
)

const mapStateToProps = ({ config }) => ({ config })

export default connect(mapStateToProps)(App)
