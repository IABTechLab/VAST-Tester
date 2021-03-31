import { combineEpics, ofType } from 'redux-observable'
import { empty as _empty, from as _from, Observable, of as _of } from 'rxjs'
import {
  catchError,
  combineLatest,
  concat,
  distinct,
  filter,
  ignoreElements,
  map,
  mapTo,
  mergeMap,
  mergeMapTo,
  skip,
  take,
  takeUntil,
  tap
} from 'rxjs/operators'

import {
  adBufferFinish,
  adBufferStart,
  adStopped,
  adVolumeChange,
  END_TEST,
  REQUEST_AD_FULLSCREEN,
  REQUEST_AD_MUTED,
  REQUEST_AD_PAUSED,
  REQUEST_AD_SKIP,
  REQUEST_VIDEO_ELEMENT_UPDATE,
  SET_MEDIA_FILE,
  SET_VIDEO_ELEMENT,
  SET_VIDEO_PAUSED,
  SET_VIDEO_PROPERTIES,
  setAdFullscreen,
  setAdMuted,
  setAdPaused,
  setVideoElement,
  setVideoMuted,
  setVideoPaused,
  setVideoProperties,
  setVideoSrc,
  START_AD,
  unsetVideoElement,
  VAST_EVENT,
  vastEvent,
  VIDEO_EVENT,
  videoEvent,
  videoPlayNoPromise,
  videoPlayPromise,
  videoPlayPromiseFulfilled,
  videoPlayPromiseRejected,
  videoWarning
} from '../actions'
import { VIDEO_ELEMENT_ID } from '../constants/dom'
import { VAST_QUARTILE_EVENT_TYPES } from '../constants/vast'
import { VIDEO_EVENT_TYPES, VIDEO_PROPERTY_NAMES } from '../constants/video'
import clamp from '../util/clamp'
import isThenable from '../util/isThenable'
import mapObject from '../util/mapObject'
import sharedDom from '../util/sharedDom'
import toJSON from '../util/toJSON'

const normalizeVideoProperties = video =>
  mapObject(VIDEO_PROPERTY_NAMES, name => toJSON(video[name]))

const sumTimeRanges = ({ data }) =>
  data.reduce((sum, { start, end }) => sum + end - start, 0)

const withoutApiFramework = ({ payload: { apiFramework } }) =>
  apiFramework == null

const toVastMediaFileActionStream = action$ =>
  action$.pipe(ofType(SET_MEDIA_FILE), filter(withoutApiFramework))

const videoElementUpdateEpic = action$ =>
  action$.pipe(
    ofType(REQUEST_VIDEO_ELEMENT_UPDATE),
    map(() => document.getElementById(VIDEO_ELEMENT_ID) || null),
    filter(videoElement => videoElement !== sharedDom.videoElement),
    tap(videoElement => {
      sharedDom.videoElement = videoElement
    }),
    map(videoElement => {
      return videoElement != null ? setVideoElement() : unsetVideoElement()
    })
  )

const bootstrapVideoElementEpic = action$ =>
  action$.pipe(
    ofType(SET_VIDEO_ELEMENT),
    mergeMapTo(
      new Observable(observer => {
        const { videoElement } = sharedDom
        const doc = videoElement.ownerDocument
        observer.next(
          setVideoProperties(normalizeVideoProperties(videoElement))
        )
        const onVideoEvent = ({ type }) => {
          observer.next(
            setVideoProperties(normalizeVideoProperties(videoElement))
          )
          observer.next(videoEvent(type))
        }
        const onFullscreenchange = () => {
          const isFullscreen = doc.fullscreenElement != null
          observer.next(setAdFullscreen(isFullscreen))
        }
        for (const type of VIDEO_EVENT_TYPES) {
          videoElement.addEventListener(type, onVideoEvent)
        }
        doc.addEventListener('fullscreenchange', onFullscreenchange)
        return () => {
          for (const type of VIDEO_EVENT_TYPES) {
            videoElement.removeEventListener(type, onVideoEvent)
          }
          doc.removeEventListener('fullscreenchange', onFullscreenchange)
        }
      }).pipe(takeUntil(action$.ofType(END_TEST)))
    )
  )

const setVideoElementSourceEpic = action$ =>
  toVastMediaFileActionStream(action$).pipe(
    map(({ payload: { url } }) => setVideoSrc(url))
  )

const toggleVideoPausedStateEpic = (action$, state$) =>
  toVastMediaFileActionStream(action$).pipe(
    combineLatest(action$.ofType(SET_VIDEO_ELEMENT)),
    mergeMap(() => {
      const {
        video: { paused }
      } = state$.value
      const { videoElement } = sharedDom
      return paused !== videoElement.paused
        ? _of(setVideoPaused(paused))
        : _empty()
    })
  )

const playPauseEpic = action$ =>
  action$.pipe(
    ofType(SET_VIDEO_PAUSED),
    mergeMap(({ payload: { paused } }) => {
      const { videoElement } = sharedDom
      if (paused) {
        videoElement.pause()
        return _empty()
      }
      const maybeThenable = videoElement.play()
      if (isThenable(maybeThenable)) {
        return _of(videoPlayPromise()).pipe(
          concat(
            _from(maybeThenable).pipe(
              mapTo(videoPlayPromiseFulfilled()),
              catchError(error => _of(videoPlayPromiseRejected(error)))
            )
          )
        )
      } else {
        return _of(videoPlayNoPromise())
      }
    })
  )

const toVideoEventStream = (action$, desiredType) =>
  action$.pipe(
    ofType(VIDEO_EVENT),
    filter(({ payload: { type } }) => type === desiredType)
  )

const startAdEpic = action$ =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(ofType(START_AD), takeUntil(action$.ofType(END_TEST)))
    ),
    mapTo(setVideoPaused(false))
  )

const filterEnded = state$ =>
  filter(() => {
    const {
      video: { properties }
    } = state$.value
    return !properties.ended
  })

const videoEventToVastEventEpic = (
  videoEventType,
  vastEventType,
  once = false,
  unlessEnded = false
) => (action$, state$) =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      toVideoEventStream(action$, videoEventType).pipe(
        ...(once ? [take(1)] : []),
        ...(unlessEnded ? [filterEnded(state$)] : []),
        takeUntil(action$.ofType(END_TEST))
      )
    ),
    mapTo(vastEvent(vastEventType))
  )

const resumeEpic = action$ =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      toVideoEventStream(action$, 'playing').pipe(
        skip(1),
        takeUntil(action$.ofType(END_TEST))
      )
    ),
    mapTo(vastEvent('resume'))
  )

const adStoppedEpic = action$ =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(
        ofType(VAST_EVENT),
        filter(({ payload: { type } }) => type === 'complete'),
        mapTo(adStopped()),
        takeUntil(action$.ofType(END_TEST))
      )
    )
  )

const adErrorEpic = action$ =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      toVideoEventStream(action$, 'error').pipe(
        combineLatest(action$.ofType(SET_VIDEO_PROPERTIES)),
        take(1),
        map(([, { payload: { properties: { error } } }]) =>
          error != null ? error.message : null
        ),
        takeUntil(action$.ofType(END_TEST))
      )
    ),
    map(message =>
      adStopped('video', message != null ? message : 'Unknown error')
    )
  )

const quartilesEpic = (action$, state$) =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      toVideoEventStream(action$, 'timeupdate').pipe(
        map(() => {
          const {
            video: {
              properties: { played, duration }
            }
          } = state$.value
          return duration > 0
            ? clamp(Math.floor((sumTimeRanges(played) / duration) * 4), 0, 4)
            : 0
        }),
        filter(quartile => quartile > 0),
        distinct(),
        takeUntil(action$.ofType(END_TEST))
      )
    ),
    map(quartile => vastEvent(VAST_QUARTILE_EVENT_TYPES[quartile - 1]))
  )

const videoEventToAdEventEpic = (videoEventType, adEvent) => action$ =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      toVideoEventStream(action$, videoEventType).pipe(
        takeUntil(action$.ofType(END_TEST))
      )
    ),
    mapTo(adEvent())
  )

const bufferFinishEpic = action$ =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      toVideoEventStream(action$, 'stalled').pipe(
        mergeMapTo(toVideoEventStream(action$, 'canplay')),
        take(1),
        takeUntil(action$.ofType(END_TEST))
      )
    ),
    mapTo(adBufferFinish())
  )

const videoPropertiesToAdStateEpic = action$ =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(
        ofType(SET_VIDEO_PROPERTIES),
        mergeMap(
          ({
            payload: {
              properties: { paused, readyState, muted, volume }
            }
          }) => [
            setAdPaused(paused || readyState < 3),
            setAdMuted(muted || volume === 0)
          ]
        ),
        takeUntil(action$.ofType(END_TEST))
      )
    )
  )

const requestAdPausedEpic = action$ =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(
        ofType(REQUEST_AD_PAUSED),
        map(({ payload: { paused } }) => setVideoPaused(paused)),
        takeUntil(action$.ofType(END_TEST))
      )
    )
  )

const requestAdMutedEpic = action$ =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(
        ofType(REQUEST_AD_MUTED),
        map(({ payload: { muted } }) => setVideoMuted(muted)),
        takeUntil(action$.ofType(END_TEST))
      )
    )
  )

const requestAdFullscreenEpic = action$ =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(
        ofType(REQUEST_AD_FULLSCREEN),
        mergeMap(({ payload: { fullscreen } }) => {
          const { videoElement } = sharedDom
          let subject, func
          if (fullscreen) {
            [subject, func] = [videoElement, 'requestFullscreen']
          } else {
            [subject, func] = [videoElement.ownerDocument, 'exitFullscreen']
          }
          if (typeof subject[func] !== 'function') {
            return _of(
              videoWarning(
                `Fullscreen API not supported: ${func}() not available`
              )
            )
          }
          const promise = subject[func]()
          return _of(promise).pipe(ignoreElements())
        }),
        takeUntil(action$.ofType(END_TEST))
      )
    )
  )

const requestAdSkipEpic = action$ =>
  toVastMediaFileActionStream(action$).pipe(
    mergeMapTo(
      action$.pipe(
        ofType(REQUEST_AD_SKIP),
        mergeMapTo(_of(setVideoSrc(null), vastEvent('skip'))),
        takeUntil(action$.ofType(END_TEST))
      )
    )
  )

export default combineEpics(
  videoElementUpdateEpic,
  bootstrapVideoElementEpic,
  startAdEpic,
  setVideoElementSourceEpic,
  toggleVideoPausedStateEpic,
  playPauseEpic,
  videoEventToVastEventEpic('loadeddata', 'impression', true),
  videoEventToVastEventEpic('canplay', 'loaded', true),
  videoEventToVastEventEpic('playing', 'start', true),
  resumeEpic,
  videoEventToVastEventEpic('pause', 'pause', false, true),
  quartilesEpic,
  videoEventToAdEventEpic('volumechange', adVolumeChange),
  videoEventToAdEventEpic('stalled', adBufferStart),
  bufferFinishEpic,
  videoEventToVastEventEpic('error', 'error', true),
  videoPropertiesToAdStateEpic,
  requestAdPausedEpic,
  requestAdMutedEpic,
  requestAdFullscreenEpic,
  requestAdSkipEpic,
  adStoppedEpic,
  adErrorEpic
)
