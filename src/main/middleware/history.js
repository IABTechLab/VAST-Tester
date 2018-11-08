import { START_TEST } from '../actions'

const history = []

const getHistory = () => history

const historyMiddleware = store => next => action => {
  if (action.type === START_TEST) {
    history.length = 0
  }
  history.push({
    ...action,
    _ts: Date.now()
  })
  return next(action)
}

export { getHistory }

export default historyMiddleware
