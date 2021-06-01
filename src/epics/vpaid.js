import { lowerCaseFirst } from 'lower-case-first'
import { combineEpics, ofType } from 'redux-observable'
import { interval as $interval, Observable, of as $of, Subject } from 'rxjs'
import {
  catchError,
  filter,
  map,
  mapTo,
  mergeMap,
  mergeMapTo,
  take,
  takeUntil,
  tap
} from 'rxjs/operators'
import { upperCaseFirst } from 'upper-case-first'

import {
  adStopped,
  adVolumeChange,
  CALL_VPAID_FUNCTION,
  callingVpaidFunction,
  callVpaidFunction,
  END_TEST,
  loadVpaid,
  REQUEST_AD_FULLSCREEN,
  REQUEST_AD_MUTED,
  REQUEST_AD_PAUSED,
  REQUEST_AD_SKIP,
  REQUEST_VPAID_DOM_UPDATE,
  SET_CONFIG,
  SET_MEDIA_FILE,
  SET_VPAID_DOM,
  SET_VPAID_PROPERTIES,
  setAdMuted,
  setAdPaused,
  setVpaidDom,
  setVpaidProperties,
  START_AD,
  START_VPAID_AD,
  startVpaidAd,
  unsetVpaidDom,
  vastEvent,
  VPAID_EVENT,
  VPAID_LOADED,
  vpaidAdObtained,
  vpaidError,
  vpaidEvent,
  vpaidHandshakeSuccessful,
  vpaidLoaded,
  vpaidLoadFailed
} from '../actions'
import { SLOT_ELEMENT_ID, VPAID_IFRAME_ID } from '../constants/dom'
import {
  VPAID_EVENT_TYPE_TO_VAST_EVENT_TYPE,
  VPAID_PROPERTY_NAMES
} from '../constants/vpaid'
import { VPAID_PROPERTIES_UPDATE_INTERVAL } from '../settings'
import errorToString from '../util/errorToString'
import loadScript from '../util/loadScript'
import sharedDom from '../util/sharedDom'
import toJSON from '../util/toJSON'
import vpaidObservable, {
  EVENT,
  invoke,
  RETURN_VALUE
} from '../util/vpaidObservable'

const PLAY_EVENTS = ['AdStarted', 'AdVideoStart', 'AdPlaying']
const PAUSE_EVENTS = ['AdPaused', 'AdError', 'AdStopped']

const withVpaidApiFramework = ({ payload: { apiFramework } }) =>
  apiFramework === 'VPAID'

const toVpaidMediaFileActionStream = action$ =>
  action$.pipe(ofType(SET_MEDIA_FILE), filter(withVpaidApiFramework))

const vpaidIframeUpdateEpic = action$ =>
  action$.pipe(
    ofType(REQUEST_VPAID_DOM_UPDATE),
    map(() => document.getElementById(VPAID_IFRAME_ID)),
    filter(iframe => iframe !== sharedDom.vpaidIframe),
    tap(iframe => {
      sharedDom.vpaidIframe = iframe
      if (iframe != null) {
        const doc = iframe.contentWindow.document
        sharedDom.slotElement = doc.getElementById(SLOT_ELEMENT_ID)
      } else {
        sharedDom.slotElement = null
      }
    }),
    map(iframe => (iframe != null ? setVpaidDom() : unsetVpaidDom()))
  )

const loadVpaidEpic = action$ =>
  toVpaidMediaFileActionStream(action$).pipe(
    mergeMap(({ payload: { url } }) =>
      action$.pipe(
        ofType(SET_VPAID_DOM),
        mergeMapTo(
          new Observable(observer => {
            const dispatch = action => observer.next(action)
            const { vpaidIframe: iframe } = sharedDom
            const doc = iframe.contentWindow.document
            dispatch(loadVpaid(url))
            loadScript(url, null, doc).then(
              () => {
                dispatch(vpaidLoaded())
              },
              error => {
                dispatch(vpaidLoadFailed(error))
              }
            )
          })
        ),
        takeUntil(action$.pipe(ofType(END_TEST)))
      )
    )
  )

const runVpaidAd = (
  win,
  slotElement,
  videoElement,
  adParameters,
  vpaidPropertiesAllowedBeforeAdLoaded,
  action$
) =>
  new Observable(observer => {
    const dispatch = action => observer.next(action)

    let vpaidAd
    try {
      vpaidAd = win.getVPAIDAd()
    } catch (error) {
      observer.error(new Error(`Failed to get VPAID ad: ${error}`))
      return
    }
    dispatch(vpaidAdObtained())

    const { in$, out$ } = vpaidObservable(vpaidAd)

    let adLoadedPublished = false

    const call = (name, args = [], silent = false) => {
      if (!silent) {
        dispatch(callingVpaidFunction(name, toJSON(args)))
      }
      in$.next(invoke(name, args, silent))
    }

    const initAd = () => {
      const doc = slotElement.ownerDocument
      const win = doc.defaultView
      const width = win.innerWidth
      const height = win.innerHeight
      const desiredBitrate = -1
      const viewMode = 'normal'
      const creativeData = {
        AdParameters: adParameters
      }
      const environmentVars = {
        slot: slotElement,
        videoSlot: videoElement
      }
      call('initAd', [
        width,
        height,
        viewMode,
        desiredBitrate,
        creativeData,
        environmentVars
      ])
    }

    let properties

    const collectProperties = () => {
      properties = {}
      for (const name of VPAID_PROPERTY_NAMES) {
        const getter = 'get' + upperCaseFirst(name)
        call(getter, [], true)
      }
    }

    const takeUntilEndTest = takeUntil(action$.pipe(ofType(END_TEST)))

    const updateProperties$ = new Subject()
    updateProperties$.pipe(takeUntilEndTest).subscribe(() => {
      if (vpaidPropertiesAllowedBeforeAdLoaded || adLoadedPublished) {
        collectProperties()
        dispatch(setVpaidProperties(properties))
      }
    })

    action$.pipe(ofType(START_VPAID_AD), takeUntilEndTest).subscribe(() => {
      call('startAd')
    })

    action$
      .pipe(ofType(CALL_VPAID_FUNCTION), takeUntilEndTest)
      .subscribe(({ payload: { name, args } }) => {
        call(name, args)
      })

    $interval(VPAID_PROPERTIES_UPDATE_INTERVAL)
      .pipe(
        takeUntilEndTest,
        takeUntil(
          action$.pipe(
            ofType(VPAID_EVENT),
            filter(
              ({ payload: { name } }) =>
                name === 'AdStopped' || name === 'AdError'
            )
          )
        )
      )
      .subscribe(() => {
        updateProperties$.next()
      })

    const returnValueHandlers = {
      handshakeVersion: (args, value) => {
        if (value !== '2.0') {
          observer.error(
            new Error(`Unexpected VPAID handshake response: ${value}`)
          )
        } else {
          dispatch(vpaidHandshakeSuccessful(value))
          initAd()
        }
      }
    }

    const eventHandlers = {
      AdLoaded: () => {
        adLoadedPublished = true
      },
      AdStopped: () => {
        dispatch(adStopped())
      },
      AdError: data => {
        const message = errorToString(data)
        dispatch(adStopped('generic', message))
        observer.error(new Error(`AdError: ${message}`))
      }
    }

    const handlers = {
      [RETURN_VALUE]: ({ name, args, value }) => {
        if (name.startsWith('get')) {
          const prop = lowerCaseFirst(name.substr(3))
          properties[prop] = value
        }
        if (returnValueHandlers[name] != null) {
          returnValueHandlers[name](args, value)
        }
      },
      [EVENT]: ({ name, data }) => {
        updateProperties$.next()
        dispatch(vpaidEvent(name, data))
        const vastEventType = VPAID_EVENT_TYPE_TO_VAST_EVENT_TYPE[name]
        if (vastEventType != null) {
          dispatch(vastEvent(vastEventType))
        }
        if (name === 'AdVolumeChange') {
          dispatch(adVolumeChange())
        }
        if (eventHandlers[name] != null) {
          eventHandlers[name](data)
        }
      }
    }

    out$.subscribe({
      next: ({ type, payload }) => {
        if (handlers[type] != null) {
          handlers[type](payload)
        }
      },
      error: error => {
        observer.error(error)
      },
      complete: () => {
        observer.complete()
      }
    })

    call('handshakeVersion', ['2.0'])
  })

const startVpaidEpic = (action$, state$) =>
  action$.pipe(
    ofType(VPAID_LOADED),
    mergeMap(() => {
      const { vpaidIframe: iframe, slotElement, videoElement } = sharedDom
      const {
        vast: { adParameters },
        config: { vpaidPropertiesAllowedBeforeAdLoaded }
      } = state$.value
      return runVpaidAd(
        iframe.contentWindow,
        slotElement,
        videoElement,
        adParameters,
        vpaidPropertiesAllowedBeforeAdLoaded,
        action$
      ).pipe(
        takeUntil(action$.pipe(ofType(END_TEST))),
        catchError(error =>
          $of(
            vpaidError(
              errorToString(error),
              error.cause != null ? error.cause.stack : null
            )
          )
        )
      )
    })
  )

const startAdEpic = action$ =>
  toVpaidMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(ofType(START_AD), takeUntil(action$.pipe(ofType(END_TEST))))
    ),
    mapTo(startVpaidAd())
  )

const muteOnStartEpic = action$ =>
  action$.pipe(
    ofType(SET_CONFIG),
    filter(({ payload: config }) => config != null && !config.audioUnmuted),
    mergeMapTo(
      action$.pipe(
        ofType(VPAID_EVENT),
        filter(({ payload: { name } }) => PLAY_EVENTS.indexOf(name) >= 0),
        take(1),
        mapTo(callVpaidFunction('setAdVolume', [0])),
        takeUntil(action$.pipe(ofType(END_TEST)))
      )
    )
  )

const vpaidEventsToPausedEpic = action$ =>
  toVpaidMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(
        ofType(VPAID_EVENT),
        map(({ payload: { name } }) =>
          PLAY_EVENTS.indexOf(name) >= 0
            ? false
            : PAUSE_EVENTS.indexOf(name) >= 0
              ? true
              : null
        ),
        filter(value => typeof value === 'boolean'),
        map(paused => setAdPaused(paused)),
        takeUntil(action$.pipe(ofType(END_TEST)))
      )
    )
  )

const vpaidVolumeToMutedEpic = action$ =>
  toVpaidMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(
        ofType(SET_VPAID_PROPERTIES),
        map(({ payload: { properties: { adVolume } } }) =>
          setAdMuted(adVolume === 0)
        ),
        takeUntil(action$.pipe(ofType(END_TEST)))
      )
    )
  )

const requestAdPausedEpic = action$ =>
  toVpaidMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(
        ofType(REQUEST_AD_PAUSED),
        map(({ payload: { paused } }) =>
          callVpaidFunction(paused ? 'pauseAd' : 'resumeAd')
        ),
        takeUntil(action$.pipe(ofType(END_TEST)))
      )
    )
  )

const requestAdMutedEpic = action$ =>
  toVpaidMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(
        ofType(REQUEST_AD_MUTED),
        map(({ payload: { muted } }) =>
          callVpaidFunction('setAdVolume', [muted ? 0 : 1])
        ),
        takeUntil(action$.pipe(ofType(END_TEST)))
      )
    )
  )

const isStrictlyPositive = val => isFinite(val) && val > 0

const requestAdFullscreenEpic = (action$, state$) =>
  toVpaidMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(
        ofType(REQUEST_AD_FULLSCREEN),
        map(({ payload: { fullscreen } }) => {
          const {
            vpaid: {
              properties: { adWidth, adHeight }
            }
          } = state$.value
          const [width, height] =
            isStrictlyPositive(adWidth) && isStrictlyPositive(adHeight)
              ? [adWidth, adHeight]
              : [sharedDom.videoSlot.width, sharedDom.videoSlot.height]
          return callVpaidFunction('resizeAd', [
            width,
            height,
            fullscreen ? 'fullscreen' : 'normal'
          ])
        }),
        takeUntil(action$.pipe(ofType(END_TEST)))
      )
    )
  )

const requestAdSkipEpic = action$ =>
  toVpaidMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(
        ofType(REQUEST_AD_SKIP),
        mapTo(callVpaidFunction('skipAd')),
        takeUntil(action$.pipe(ofType(END_TEST)))
      )
    )
  )

export default combineEpics(
  vpaidIframeUpdateEpic,
  loadVpaidEpic,
  startVpaidEpic,
  startAdEpic,
  muteOnStartEpic,
  vpaidEventsToPausedEpic,
  vpaidVolumeToMutedEpic,
  requestAdPausedEpic,
  requestAdMutedEpic,
  requestAdFullscreenEpic,
  requestAdSkipEpic
)
