import { ofType } from 'redux-observable'
import { mapTo } from 'rxjs/operators'

import { loadVast, START_TEST } from '../actions'

const testEpic = action$ => action$.pipe(ofType(START_TEST), mapTo(loadVast()))

export default testEpic
