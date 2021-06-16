import { combineEpics, ofType } from 'redux-observable'
import { of as $of } from 'rxjs'
import { filter, map, mergeMap, withLatestFrom } from 'rxjs/operators'

import { VAST_EVENT, vastTrackerFired } from '../actions'

const getVastTrackingUris = (vastEvent, state) => {
  try {
    switch (vastEvent) {
      case 'impression':
        return state.vast.inLine.impressions.map(it => it.uri)
      case 'error':
        return state.vast.inLine.errors.map(it => it.uri)
      case 'clickThrough':
        return state.vast.linear.videoClicks.clickTrackings.map(it => it.uri)
      default:
        return state.vast.trackingEvents[vastEvent].map(it => it.uri)
    }
  } catch (e) {
    return null
  }
}

const vastTrackingEpic = (action$, state$) =>
  action$.pipe(
    ofType(VAST_EVENT),
    withLatestFrom(state$),
    map(([{ payload: { type } }, state]) => [
      type,
      getVastTrackingUris(type, state)
    ]),
    filter(([, uris]) => uris != null && uris.length > 0),
    mergeMap(([type, uris]) => $of(...uris.map(uri => [type, uri]))),
    map(([type, uri]) => vastTrackerFired(type, uri))
  )

export default combineEpics(vastTrackingEpic)
