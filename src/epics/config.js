import { ofType } from 'redux-observable'
import { of as _of } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { endTest, SET_CONFIG, startTest } from '../actions'

const configEpic = action$ =>
  action$.pipe(
    ofType(SET_CONFIG),
    mergeMap(({ payload: config }) => {
      const actions = [endTest()]
      if (config != null) {
        actions.push(startTest())
      }
      return _of(...actions)
    })
  )

export default configEpic
