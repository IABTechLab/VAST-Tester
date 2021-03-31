import '../style/app.scss'

import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import ApplyConfig from '../containers/ApplyConfig'
import Config from '../containers/Config'
import Runner from '../containers/Runner'
import Share from '../containers/Share'
import About from './About'

const App = () => (
  <HashRouter>
    <>
      <Runner />
      <Switch>
        <Route exact path="/" component={Config} />
        <Route exact path="/run" component={ApplyConfig} />
        <Route exact path="/share" component={Share} />
        <Route exact path="/about" component={About} />
      </Switch>
    </>
  </HashRouter>
)

export default App
