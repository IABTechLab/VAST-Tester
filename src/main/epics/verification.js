import { of as _of, merge as _merge } from 'rxjs'
import {
  bufferWhen,
  catchError,
  combineLatest,
  filter,
  ignoreElements,
  map,
  mapTo,
  mergeMap,
  skipUntil,
  startWith,
  take,
  takeUntil,
  tap
} from 'rxjs/operators'
import { ofType, combineEpics } from 'redux-observable'
import timeout from 'p-timeout'
import {
  AD_BUFFER_FINISH,
  AD_BUFFER_START,
  AD_STOPPED,
  AD_VOLUME_CHANGE,
  END_TEST,
  FINISH_VERIFICATION_SESSION,
  LOAD_VERIFICATION_HOST,
  SCHEDULE_VERIFICATION_EVENT,
  SCHEDULE_VERIFICATION_SESSION_FINISH,
  START_TEST,
  START_VERIFICATION_SESSION,
  VAST_EVENT,
  VERIFICATION_EVENT,
  VERIFICATION_HOST_LOADED,
  VERIFICATION_SCRIPT_LOAD_ERROR,
  VERIFICATION_SCRIPT_LOADED,
  VERIFICATION_SCRIPT_SESSION_START_ERROR,
  VERIFICATION_SCRIPT_SESSION_STARTED,
  finishVerificationSession,
  scheduleVerificationEvent,
  scheduleVerificationSessionFinish,
  startVerificationSession,
  verificationEvent,
  verificationScriptLoaded,
  verificationScriptLoadError,
  verificationScriptSessionStarted,
  verificationScriptSessionStartError,
  verificationScriptsStarted
} from '../actions'
import {
  SESSION_START_TIMEOUT,
  SCRIPT_LOAD_TIMEOUT,
  APP_VERSION
} from '../../common/settings'
import { OMID_EVENT_TYPES } from '../../common/constants/omid'
import verificationServer from '../util/verificationServer'
import sharedDom from '../util/sharedDom'
import msToString from '../../common/util/msToString'
import noop from '../../common/util/noop'

// Not included:
// - containerGeometry
// - onScreenContainerGeometry
const createAdView = () => {
  const { videoElement } = sharedDom
  const {
    top: x,
    left: y,
    width,
    height
  } = videoElement.getBoundingClientRect()
  return {
    percentageInView: 100,
    geometry: { x, y, width, height },
    onScreenGeometry: {
      x: 0,
      y: 0,
      width,
      height,
      obstructions: []
    },
    measuringElement: false,
    reasons: []
  }
}

const createVerificationEventData = (
  eventType,
  { duration, videoPlayerVolume }
) => {
  switch (eventType) {
    case 'impression':
      return {
        mediaType: 'video',
        videoEventAdaptorType: 'jsCustom',
        videoEventAdaptorVersion: APP_VERSION,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        adView: createAdView()
      }
    case 'loaded':
      // Not included: skipOffset: null
      return {
        skippable: false,
        autoPlay: true,
        position: 'standalone'
      }
    case 'start':
      // Not included: deviceVolume
      return {
        duration,
        videoPlayerVolume
      }
    case 'volumeChange':
      // Not included: deviceVolume
      return {
        videoPlayerVolume
      }
    default:
      return {}
  }
}

const delayUntilSessionStart = (eventType, mapPayload, once = false) => (
  action$,
  state$
) =>
  action$.pipe(
    ofType(START_TEST),
    mergeMap(() => {
      const sessionStart$ = action$.ofType(START_VERIFICATION_SESSION)
      const actionsOfType$ = action$.pipe(
        ofType(eventType),
        map(({ payload }) => mapPayload(payload, state$.value))
      )
      const before$ = actionsOfType$.pipe(
        bufferWhen(() => sessionStart$),
        mergeMap(actions => _of(...actions))
      )
      const after$ = actionsOfType$.pipe(skipUntil(sessionStart$))
      return _merge(before$, after$).pipe(
        ...(once ? [take(1)] : []),
        takeUntil(action$.ofType(END_TEST))
      )
    })
  )

const verificationHostLoadingToScriptInsertionResultEpic = action$ =>
  action$.pipe(
    ofType(LOAD_VERIFICATION_HOST),
    mergeMap(({ payload: { verification, clientId } }) => {
      const client = verificationServer.getClient(clientId)
      verification.clientId = client.id
      const receivingScriptInsertionResult = timeout(
        client.receive('acceptScriptInsertionResult'),
        SCRIPT_LOAD_TIMEOUT,
        `Script not loaded after ${msToString(SCRIPT_LOAD_TIMEOUT)}`
      )
      receivingScriptInsertionResult.catch(noop)
      return action$.pipe(
        ofType(VERIFICATION_HOST_LOADED),
        filter(({ payload: { verification: ver } }) => ver === verification),
        mergeMap(() =>
          Promise.all([client.ready, receivingScriptInsertionResult])
        ),
        map(([_, scriptInsertionResult]) => {
          if (scriptInsertionResult.error != null) {
            throw scriptInsertionResult.error
          } else {
            return verificationScriptLoaded(verification)
          }
        }),
        catchError(error => {
          client.dispose()
          return _of(verificationScriptLoadError(verification, error))
        }),
        takeUntil(action$.ofType(END_TEST))
      )
    })
  )

const verificationHostLoadedToSessionStartedEpic = action$ =>
  action$.pipe(
    ofType(VERIFICATION_HOST_LOADED),
    mergeMap(({ payload: { verification, iframeId } }) => {
      const client = verificationServer.getClient(verification.clientId)
      client.window = document.getElementById(iframeId).contentWindow
      const receivingSessionStarted = client.receive('acceptSessionStart')
      return action$.pipe(
        ofType(VERIFICATION_SCRIPT_LOADED),
        filter(({ payload: { verification: ver } }) => ver === verification),
        mergeMap(() =>
          timeout(
            receivingSessionStarted,
            SESSION_START_TIMEOUT,
            `Session not started after ${msToString(SESSION_START_TIMEOUT)}`
          )
        ),
        mapTo(verificationScriptSessionStarted(verification)),
        catchError(error => {
          client.dispose()
          return _of(verificationScriptSessionStartError(verification, error))
        }),
        takeUntil(action$.ofType(END_TEST))
      )
    })
  )

const startSessionEpic = action$ =>
  action$.pipe(
    ofType(START_VERIFICATION_SESSION),
    tap(() => {
      verificationServer.broadcast('startSession')
    }),
    ignoreElements()
  )

const finishSessionEpic = action$ =>
  action$.pipe(
    ofType(FINISH_VERIFICATION_SESSION),
    tap(({ payload: { error } }) => {
      verificationServer.broadcast('finishSession', { error })
    }),
    ignoreElements()
  )

const verificationEventAfterSessionStartEpic = delayUntilSessionStart(
  SCHEDULE_VERIFICATION_EVENT,
  ({ type }, state) => {
    const [realType, data] =
      type === 'clickThrough'
        ? ['adUserInteraction', { interactionType: 'click' }]
        : type === 'skip'
          ? ['skipped', {}]
          : [type, createVerificationEventData(type, state.verification)]
    return verificationEvent(realType, data)
  }
)

const verificationSessionFinishAfterSessionStartEpic = delayUntilSessionStart(
  SCHEDULE_VERIFICATION_SESSION_FINISH,
  ({ error }) => finishVerificationSession(error),
  true
)

const broadcastVerificationEventEpic = action$ =>
  action$.pipe(
    ofType(VERIFICATION_EVENT),
    tap(({ payload: event }) => {
      verificationServer.broadcast('dispatchEvent', {
        event
      })
    }),
    ignoreElements()
  )

const startSessionIfDoneLoadingEpic = (action$, state$) =>
  action$.pipe(
    ofType(VERIFICATION_SCRIPT_LOADED, VERIFICATION_SCRIPT_LOAD_ERROR),
    map(() => {
      const {
        verification: { scriptsLoaded, scriptsFailed, verifications }
      } = state$.value
      return scriptsFailed === verifications.length
        ? verificationScriptsStarted(0)
        : scriptsLoaded + scriptsFailed === verifications.length
          ? startVerificationSession()
          : null
    }),
    filter(Boolean)
  )

const sessionsStartedEpic = (action$, state$) =>
  action$.pipe(
    ofType(START_TEST),
    mergeMap(() => {
      const sessionIsFinished$ = action$.pipe(
        ofType(SCHEDULE_VERIFICATION_SESSION_FINISH),
        mapTo(true),
        startWith(false)
      )
      return action$.pipe(
        ofType(
          VERIFICATION_SCRIPT_SESSION_STARTED,
          VERIFICATION_SCRIPT_SESSION_START_ERROR
        ),
        map(() => {
          const {
            verification: { scriptsLoaded, sessionsStarted, sessionsFailed }
          } = state$.value
          return sessionsStarted + sessionsFailed === scriptsLoaded
            ? sessionsStarted
            : -1
        }),
        filter(n => n >= 0),
        combineLatest(sessionIsFinished$),
        map(([sessionsStarted, sessionFinished]) =>
          verificationScriptsStarted(sessionsStarted, sessionFinished)
        ),
        take(1),
        takeUntil(action$.ofType(END_TEST))
      )
    })
  )

const serverResetEpic = action$ =>
  action$.pipe(
    ofType(START_TEST, END_TEST),
    tap(() => {
      verificationServer.reset()
    }),
    ignoreElements()
  )

const vastEventToVerificationEventEpic = action$ =>
  action$.pipe(
    ofType(VAST_EVENT),
    map(({ payload: { type } }) => type),
    filter(
      type =>
        type === 'clickThrough' ||
        type === 'skip' ||
        OMID_EVENT_TYPES.includes(type)
    ),
    map(type => scheduleVerificationEvent(type))
  )

const adEventToVerificationEventEpic = (
  adEventType,
  verificationEventType
) => action$ =>
  action$.pipe(
    ofType(adEventType),
    mapTo(scheduleVerificationEvent(verificationEventType))
  )

const adStoppedToVerificationSessionFinishEpic = action$ =>
  action$.pipe(
    ofType(AD_STOPPED),
    map(({ payload }) => scheduleVerificationSessionFinish(payload))
  )

export default combineEpics(
  verificationHostLoadingToScriptInsertionResultEpic,
  verificationHostLoadedToSessionStartedEpic,
  startSessionEpic,
  finishSessionEpic,
  verificationEventAfterSessionStartEpic,
  verificationSessionFinishAfterSessionStartEpic,
  broadcastVerificationEventEpic,
  startSessionIfDoneLoadingEpic,
  sessionsStartedEpic,
  serverResetEpic,
  vastEventToVerificationEventEpic,
  adEventToVerificationEventEpic(AD_VOLUME_CHANGE, 'volumeChange'),
  adEventToVerificationEventEpic(AD_BUFFER_START, 'bufferStart'),
  adEventToVerificationEventEpic(AD_BUFFER_FINISH, 'bufferFinish'),
  adStoppedToVerificationSessionFinishEpic
)
