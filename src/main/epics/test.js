import { mapTo } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { START_TEST, loadVast } from '../actions'

const testEpic = action$ =>
  action$.pipe(
    ofType(START_TEST),
    mapTo(loadVast())
  )

export default testEpic
