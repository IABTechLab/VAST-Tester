import { combineEpics, ofType } from 'redux-observable'
import { combineLatest as $combineLatest, of as $of } from 'rxjs'
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  skip,
  takeUntil
} from 'rxjs/operators'

import {
  END_TEST,
  SCHEDULE_AD_START,
  scheduleAdStart,
  SET_AD_ACTIVE,
  SET_AD_MUTED,
  SET_CONFIG,
  setAdActive,
  startAd,
  VAST_EVENT,
  vastEvent,
  VERIFICATION_READY
} from '../actions'
import { PRELOAD_SIMULATION_TIME } from '../settings'

const scheduleAdStartEpic = action$ =>
  action$.pipe(
    ofType(SET_CONFIG),
    map(({ payload: config }) => config),
    filter(Boolean),
    mergeMap(config =>
      $combineLatest(
        action$.pipe(
          ofType(VAST_EVENT),
          filter(({ payload: { type } }) => type === 'loaded')
        ),
        action$.ofType(VERIFICATION_READY)
      ).pipe(mapTo(config), takeUntil(action$.ofType(END_TEST)))
    ),
    map(config => scheduleAdStart(config.startDelayed))
  )

const adStartEpic = action$ =>
  action$.pipe(
    ofType(SCHEDULE_AD_START),
    mergeMap(({ payload: settings }) => {
      let result = $of(settings)
      if (settings.delayed) {
        result = result.pipe(
          delay(PRELOAD_SIMULATION_TIME),
          takeUntil(action$.ofType(END_TEST))
        )
      }
      return result
    }),
    map(settings => startAd(settings.delayed))
  )

const muteUnmuteEpic = action$ =>
  action$.pipe(
    ofType(SET_CONFIG),
    map(({ payload: config }) => config),
    filter(Boolean),
    mergeMap(config =>
      $combineLatest(
        action$.ofType(SET_AD_MUTED),
        action$.pipe(
          ofType(SET_AD_ACTIVE),
          filter(({ payload: { active } }) => active)
        )
      ).pipe(
        map(
          ([
            {
              payload: { muted }
            }
          ]) => muted
        ),
        distinctUntilChanged(),
        skip(1),
        map(muted => vastEvent(muted ? 'mute' : 'unmute')),
        takeUntil(action$.ofType(END_TEST))
      )
    )
  )

const mapVastEventsToAdActive = (vastEvents, active) => action$ =>
  action$.pipe(
    ofType(VAST_EVENT),
    filter(({ payload: { type } }) => vastEvents.indexOf(type) >= 0),
    mapTo(setAdActive(active))
  )

export default combineEpics(
  scheduleAdStartEpic,
  adStartEpic,
  muteUnmuteEpic,
  mapVastEventsToAdActive(['start'], true),
  mapVastEventsToAdActive(['complete', 'skip', 'error'], false)
)
