import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createLogger } from 'redux-logger'
import { combineEpics, createEpicMiddleware } from 'redux-observable'

import App from './components/App'
import epics from './epics'
import middleware from './middleware'
import reducer from './reducers'

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

const rootEpic = combineEpics(...epics)
const epicMiddleware = createEpicMiddleware()
const store = createStore(
  reducer,
  composeMiddleware([...middleware, epicMiddleware])
)
epicMiddleware.run(rootEpic)
const dom = (
  <Provider store={store}>
    <App />
  </Provider>
)
render(dom, document.getElementById('root'))
