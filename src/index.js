import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import URLSearchParams from 'url-search-params'
import adTester from './main'
import verification from './verification'

const ROUTES = {
  default: adTester,
  verification
}

const composeMiddleware = middleware => {
  if (process.env.NODE_ENV === 'development') {
    if (
      window.localStorage != null &&
      window.localStorage.reduxLogger === 'true'
    ) {
      middleware.push(createLogger())
    }
    return composeWithDevTools(applyMiddleware(...middleware))
  } else {
    return applyMiddleware(...middleware)
  }
}

const route = () => {
  const params = new URLSearchParams(window.location.search)
  const requestedMode = params.get('mode')
  const mode = Object.prototype.hasOwnProperty.call(ROUTES, requestedMode)
    ? requestedMode
    : 'default'
  const { App, reducer, middleware, epics } = ROUTES[mode]
  let dom = <App />
  if (reducer != null) {
    const rootEpic = combineEpics(...epics)
    const epicMiddleware = createEpicMiddleware()
    const store = createStore(
      reducer,
      composeMiddleware([...middleware, epicMiddleware])
    )
    epicMiddleware.run(rootEpic)
    dom = <Provider store={store}>{dom}</Provider>
  }
  render(dom, document.getElementById('root'))
}

route()
