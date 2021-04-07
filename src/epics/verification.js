import { combineEpics, ofType } from 'redux-observable'
import { of as _of } from 'rxjs'
import {
  combineLatest,
  delay,
  filter,
  ignoreElements,
  map,
  mapTo,
  mergeMap,
  mergeMapTo,
  takeUntil,
  tap
} from 'rxjs/operators'

import {
  AD_STOPPED,
  END_TEST,
  SET_CONFIG,
  SET_VIDEO_ELEMENT,
  START_TEST,
  VAST_EVENT,
  VAST_LOADED,
  VERIFICATION_READY,
  verificationErrorEvent,
  verificationEvent,
  verificationReady,
  verificationSessionFinished
} from '../actions'
import sharedDom from '../util/sharedDom'

const VIDEO_POSITION = 'standalone'
const FINISH_DELAY = 1000

const QUARTILE_EVENTS = [
  'firstQuartile',
  'midpoint',
  'thirdQuartile',
  'complete'
]

let omsdk, iframe, adSession, adEvents, mediaEvents

const tearDown = () => {
  if (iframe == null) {
    return
  }
  iframe.parentNode.removeChild(iframe)
  mediaEvents = null
  adEvents = null
  adSession = null
  iframe = null
  omsdk = null
}

const createSdkIframe = () =>
  new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe')
    iframe.sandbox = 'allow-scripts allow-same-origin'
    iframe.style.display = 'none'
    iframe.srcdoc = ['omweb-v1.js', 'omid-session-client-v1.js']
      .map(src => `<script src="fixtures/omid/${src}"></script>`)
      .join('')
    iframe.addEventListener('load', () => {
      resolve(iframe)
    })
    iframe.addEventListener('error', () => {
      reject(new Error('Unknown error'))
    })
    document.body.appendChild(iframe)
  })

const createResources = (verifications, accessMode) =>
  verifications.map(
    ({ uri, vendor, verificationParameters }) =>
      new omsdk.VerificationScriptResource(
        uri,
        vendor,
        verificationParameters,
        accessMode
      )
  )

const createContext = (resources, serviceWindow) => {
  const partner = new omsdk.Partner(
    process.env.REACT_APP_VENDOR + ' ' + process.env.REACT_APP_NAME,
    process.env.REACT_APP_VERSION
  )
  const context = new omsdk.Context(partner, resources, null)
  context.underEvaluation = true
  context.setVideoElement(sharedDom.videoElement)
  context.setServiceWindow(serviceWindow)
  return context
}

const createAdSession = context => {
  const adSession = new omsdk.AdSession(context)
  adSession.setCreativeType('video')
  return adSession
}

const setUpAdSession = async (verifications, accessMode) => {
  tearDown()
  iframe = await createSdkIframe()
  const serviceWindow = iframe.contentWindow
  omsdk = serviceWindow.OmidSessionClient.default
  adSession = createAdSession(
    createContext(createResources(verifications, accessMode), serviceWindow)
  )
  adEvents = new omsdk.AdEvents(adSession)
  mediaEvents = new omsdk.MediaEvents(adSession)
  adSession.start()
}

const filterVASTEvents = (action$, type) =>
  action$.pipe(
    ofType(VAST_EVENT),
    filter(({ payload }) => payload.type === type)
  )

const startVerificationSessionWhenVastAndVideoAvailableEpic = action$ =>
  action$.pipe(
    ofType(SET_CONFIG),
    map(({ payload: config }) => config),
    filter(Boolean),
    mergeMap(({ omAccessMode }) =>
      action$.pipe(
        ofType(VAST_LOADED),
        combineLatest(action$.ofType(SET_VIDEO_ELEMENT)),
        map(([{ payload }]) => payload.verifications),
        mergeMap(async verifications => {
          const enabled = verifications.length > 0
          if (enabled) {
            await setUpAdSession(verifications, omAccessMode)
          }
          return enabled
        }),
        takeUntil(action$.ofType(END_TEST))
      )
    ),
    map(enabled => verificationReady(enabled))
  )

const dispatchLoadedEpic = action$ =>
  filterVASTEvents(action$, 'loaded').pipe(
    tap(() => {
      if (adEvents != null) {
        // TODO Get skip information from VAST
        const isSkippable = true
        const skipOffset = 0
        const isAutoPlay = true
        adEvents.loaded(
          new omsdk.VastProperties(
            isSkippable,
            skipOffset,
            isAutoPlay,
            VIDEO_POSITION
          )
        )
      }
    }),
    mapTo(verificationEvent('loaded'))
  )

const dispatchImpressionEpic = action$ =>
  filterVASTEvents(action$, 'impression').pipe(
    tap(() => {
      if (adEvents != null) {
        adEvents.impressionOccurred()
      }
    }),
    mapTo(verificationEvent('impression'))
  )

const dispatchErrorEpic = action$ =>
  action$.pipe(
    ofType(AD_STOPPED),
    map(({ payload }) => payload),
    filter(Boolean),
    tap(({ errorType, message }) => {
      if (adSession != null) {
        adSession.error(errorType, message)
      }
    }),
    map(({ errorType, message }) => verificationErrorEvent(errorType, message))
  )

const dispatchStartEpic = (action$, state$) =>
  filterVASTEvents(action$, 'start').pipe(
    tap(() => {
      if (mediaEvents != null) {
        const {
          vast: vastState,
          vpaid: vpaidState,
          video: videoState
        } = state$.value
        const [duration, volume] =
          vastState.mediaFile.apiFramework === 'VPAID'
            ? [vpaidState.properties.adDuration, vpaidState.properties.adVolume]
            : [videoState.properties.duration, videoState.properties.volume]
        mediaEvents.start(duration, volume)
      }
    }),
    mapTo(verificationEvent('start'))
  )

const dispatchQuartilesEpic = action$ =>
  action$.pipe(
    ofType(VAST_EVENT),
    map(({ payload: { type } }) => type),
    filter(type => QUARTILE_EVENTS.includes(type)),
    tap(type => {
      if (mediaEvents != null) {
        mediaEvents[type]()
      }
    }),
    map(type => verificationEvent(type))
  )

const finishSessionEpic = action$ =>
  action$.pipe(
    ofType(VERIFICATION_READY),
    filter(({ payload }) => payload.enabled),
    mergeMapTo(
      _of(null).pipe(
        combineLatest(filterVASTEvents(action$, 'complete')),
        delay(FINISH_DELAY),
        tap(() => {
          adSession.finish()
        }),
        takeUntil(action$.ofType(END_TEST))
      )
    ),
    mapTo(verificationSessionFinished())
  )

const tearDownOnEndEpic = action$ =>
  action$.pipe(
    ofType(END_TEST),
    tap(() => {
      tearDown()
    }),
    ignoreElements()
  )

export default combineEpics(
  startVerificationSessionWhenVastAndVideoAvailableEpic,
  dispatchLoadedEpic,
  dispatchImpressionEpic,
  dispatchErrorEpic,
  dispatchStartEpic,
  dispatchQuartilesEpic,
  finishSessionEpic,
  tearDownOnEndEpic
)
