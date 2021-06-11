import { VASTLoader } from 'iab-vast-loader/browser'
import { flatten } from 'lodash-es'
import { combineEpics, ofType } from 'redux-observable'
import { from as $from, merge as $merge, of as $of, Subject } from 'rxjs'
import { catchError, map, mergeMap, takeUntil } from 'rxjs/operators'

import {
  END_TEST,
  LOAD_VAST,
  setAdMuted,
  setMediaFile,
  setVideoMuted,
  unsupportedMediaFiles,
  VAST_LOADED,
  vastLoaded,
  vastLoadFailed,
  vastWarning
} from '../actions'
import removeKey from '../util/removeKey'
import sharedDom from '../util/sharedDom'
import toJSON from '../util/toJSON'
import * as xmlUtil from '../util/xml'

const warnings$ = new Subject()

const warn = (message, url) => {
  warnings$.next(vastWarning(message, url))
}

const getAdFromVast = (type, warn) => vast => {
  if (vast.version >= '4.0') {
    warn('Support for VAST 4 is incomplete', vast.uri)
  }
  if (vast.adPod != null) {
    warn('Ad pods not supported yet', vast.uri)
  }
  const ads = vast.ads.toArray().filter(ad => ad.$type === type)
  if (ads.length === 0) {
    throw new Error('VAST does not contain ad buffet')
  }
  if (ads.length > 1) {
    warn(`Multiple ${type} elements in VAST, using first`, vast.uri)
  }
  return ads[0]
}

const loadVastChain = (vastUrl, warn) =>
  $from(new VASTLoader(vastUrl, { noSingleAdPods: true }).load()).pipe(
    map(chain => {
      const wrapperVasts = chain.slice(0, chain.length - 1)
      const wrappers = wrapperVasts.map(getAdFromVast('Wrapper', warn))
      const inLineVast = chain[chain.length - 1]
      const inLine = getAdFromVast('InLine', warn)(inLineVast)
      return { chain, wrappers, inLine }
    })
  )

const getLinearFromInLine = (inLine, warn) => {
  const linearCreatives = inLine.creatives
    .toArray()
    .filter(creative => creative.linear != null)
  if (linearCreatives.length > 1) {
    warn('Multiple Linear elements in InLine, using first', inLine.uri)
  }
  return linearCreatives[0].linear
}

const parseVerificationInstance = verification => {
  const jsResource = verification.javaScriptResources[0]
  if (jsResource != null) {
    return {
      apiFramework: verification.apiFramework,
      vendor: verification.vendor,
      verificationParameters: verification.parameters,
      uri: jsResource.uri
    }
  } else {
    return null
  }
}

const parseVerificationElement = verification => {
  const omidJsResource = xmlUtil
    .children(verification, 'JavaScriptResource')
    .find(resource => resource.getAttribute('apiFramework') === 'omid')
  if (omidJsResource != null) {
    const params = xmlUtil.child(verification, 'VerificationParameters')
    return {
      apiFramework: omidJsResource.getAttribute('apiFramework'),
      vendor: verification.getAttribute('vendor'),
      verificationParameters: params != null ? params.textContent : null,
      uri: xmlUtil.text(omidJsResource)
    }
  } else {
    return null
  }
}

const selectVerifications = ads =>
  flatten(
    ads.map(ad => {
      const vast4Verifications = ad.verifications
        .map(parseVerificationInstance)
        .filter(Boolean)
      const extVerifications = flatten(
        ad.extensions
          .filter(extension => extension.type === 'AdVerifications')
          .map(extension =>
            xmlUtil
              .descendants(extension.xmlElement, [
                'AdVerifications',
                'Verification'
              ])
              .map(parseVerificationElement)
              .filter(Boolean)
          )
      )
      return [...vast4Verifications, ...extVerifications]
    })
  )

const xmlToJSON = elem => {
  const json = toJSON(elem)
  removeKey(json, 'xmlElement')
  return json
}

const loadAndAnalyzeVastChain = (url, warn) =>
  loadVastChain(url, warn).pipe(
    map(({ chain, wrappers, inLine }) => {
      const linear = getLinearFromInLine(inLine, warn)
      const verifications = selectVerifications([...wrappers, inLine])
      return {
        chain: xmlToJSON(chain),
        inLine: xmlToJSON(inLine),
        linear: xmlToJSON(linear),
        verifications
      }
    })
  )

const selectVideos = (mediaFiles, response, videoElement) =>
  mediaFiles.filter(
    mediaFile =>
      mediaFile.type !== 'video/3gpp' &&
      videoElement.canPlayType(mediaFile.type) === response
  )

const triageMediaFiles = linear => {
  const vpaidMedia = []
  const vanillaMedia = []
  for (const mediaFile of linear.mediaFiles) {
    if (mediaFile.apiFramework == null) {
      vanillaMedia.push(mediaFile)
    } else if (
      mediaFile.apiFramework === 'VPAID' &&
      mediaFile.type === 'application/javascript'
    ) {
      vpaidMedia.push(mediaFile)
    }
  }
  return [vpaidMedia, vanillaMedia]
}

const sortByDimensions = mediaFiles =>
  mediaFiles.slice().sort((a, b) => a.width - b.width || a.height - b.height)

const selectByDimensions = (mediaFiles, maxWidth, maxHeight) => {
  const sorted = sortByDimensions(mediaFiles)
  let i = 0
  while (
    i + 1 < sorted.length &&
    sorted[i + 1].width <= maxWidth &&
    sorted[i + 1].height <= maxHeight
  ) {
    ++i
  }
  return sorted[i]
}

const selectMediaFile = (linear, vpaidEnabled) => {
  const { videoElement } = sharedDom
  const [vpaidMedia, vanillaMedia] = triageMediaFiles(linear)
  if (vpaidEnabled && vpaidMedia.length > 0) {
    return vpaidMedia[0]
  }
  const { offsetWidth: maxWidth, offsetHeight: maxHeight } = videoElement
  const canProbablyPlay = selectVideos(vanillaMedia, 'probably', videoElement)
  if (canProbablyPlay.length > 0) {
    return selectByDimensions(canProbablyPlay, maxWidth, maxHeight)
  }
  const canMaybePlay = selectVideos(vanillaMedia, 'maybe', videoElement)
  if (canMaybePlay.length > 0) {
    return selectByDimensions(canMaybePlay, maxWidth, maxHeight)
  }
  return null
}

const loadVastEpic = (action$, state$) =>
  action$.pipe(
    ofType(LOAD_VAST),
    mergeMap(() => {
      const {
        config: { vastUrl }
      } = state$.value
      return $merge(
        loadAndAnalyzeVastChain(vastUrl, warn).pipe(
          map(({ chain, inLine, linear, verifications }) =>
            vastLoaded(chain, inLine, linear, verifications)
          ),
          catchError(error => $of(vastLoadFailed(error)))
        ),
        warnings$
      ).pipe(takeUntil(action$.pipe(ofType(END_TEST))))
    })
  )

const vastLoadedEpic = (action$, state$) =>
  action$.pipe(
    ofType(VAST_LOADED),
    mergeMap(({ payload: { linear } }) => {
      const {
        config: { audioUnmuted, vpaidEnabled }
      } = state$.value
      const mediaFile = selectMediaFile(linear, vpaidEnabled)
      const results = []
      if (mediaFile != null) {
        results.push(
          setAdMuted(!audioUnmuted),
          setVideoMuted(!audioUnmuted),
          setMediaFile(
            mediaFile.uri,
            mediaFile.apiFramework,
            linear.adParameters
          )
        )
      } else {
        results.push(unsupportedMediaFiles(), setMediaFile(null, null, null))
      }
      return $of(...results)
    })
  )

export default combineEpics(loadVastEpic, vastLoadedEpic)
