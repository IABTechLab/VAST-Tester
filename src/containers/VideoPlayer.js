import React from 'react'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'

import {
  requestAdFullscreen,
  requestAdMuted,
  requestAdPaused,
  requestAdSkip,
  requestVideoElementUpdate,
  requestVpaidDomUpdate
} from '../actions'
import {
  VIDEO_ELEMENT_ID,
  VPAID_IFRAME_HTML,
  VPAID_IFRAME_ID
} from '../constants/dom'

const kLoadedSrc = Symbol('loadedSrc')

const acceptVideoRef = ({ shared, videoMuted }, callback) => element => {
  if (element == null) {
    return
  }
  // React only sets the muted property, not the attribute
  // See https://github.com/facebook/react/issues/6544
  element.defaultMuted = videoMuted
  // Load video source if it's not being controlled by a VPAID unit
  if (
    !shared &&
    element[kLoadedSrc] !== element.src &&
    typeof element.load === 'function'
  ) {
    element.load()
    element[kLoadedSrc] = element.src
  }
  // Dispatch
  callback(element)
}

const acceptIframeRef = iframe => {
  if (iframe == null) {
    return
  }
  const doc = iframe.contentWindow.document
  doc.open()
  doc.write(VPAID_IFRAME_HTML)
  doc.close()
}

const VideoPlayer = ({
  shared,
  videoSrc,
  videoMuted,
  adActive,
  adPaused,
  adMuted,
  adFullscreen,
  onVideoElementRef,
  onVpaidIframeLoaded,
  onSetAdPaused,
  onSetAdMuted,
  onSetAdFullscreen,
  onSkipAd
}) => (
  <div className="video-player">
    <div className="video-player-main">
      <div className="video-player-inner">
        <video
          id={VIDEO_ELEMENT_ID}
          src={videoSrc}
          muted={videoMuted}
          playsInline
          ref={acceptVideoRef({ shared, videoMuted }, onVideoElementRef)}
        />
        {shared
          ? (
          <iframe
            id={VPAID_IFRAME_ID}
            src="about:blank"
            className="vpaid-host"
            title="VPAID Host"
            ref={acceptIframeRef}
            onLoad={onVpaidIframeLoaded}
          />
            )
          : null}
      </div>
    </div>
    <div className="video-player-controls">
      <nav>
        <ul className="ad-controls">
          <li>
            <button
              title="Skip Ad"
              onClick={adActive ? onSkipAd : null}
              className={adActive ? '' : 'disabled'}
            >
              <FontAwesome name="close" />
            </button>
          </li>
        </ul>
        <ul className="playback-controls">
          <li>
            <button
              title={adPaused ? 'Resume Ad' : 'Pause Ad'}
              onClick={adActive ? () => onSetAdPaused(!adPaused) : null}
              className={adActive ? '' : 'disabled'}
            >
              <FontAwesome name={adPaused ? 'play' : 'pause'} />
            </button>
          </li>
          <li>
            <button
              title={adMuted ? 'Unmute Audio' : 'Mute Audio'}
              onClick={adActive ? () => onSetAdMuted(!adMuted) : null}
              className={adActive ? '' : 'disabled'}
            >
              <FontAwesome name={adMuted ? 'volume-off' : 'volume-up'} />
            </button>
          </li>
          <li>
            <button
              title={adFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              onClick={adActive ? () => onSetAdFullscreen(!adFullscreen) : null}
              className={adActive ? '' : 'disabled'}
            >
              <FontAwesome name={adFullscreen ? 'compress' : 'expand'} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
)

const mapStateToProps = ({
  video: { shared, src: videoSrc, muted: videoMuted, paused: videoPaused },
  ad: {
    active: adActive,
    paused: adPaused,
    muted: adMuted,
    fullscreen: adFullscreen
  }
}) => ({
  shared,
  videoSrc,
  videoPaused,
  videoMuted,
  adActive,
  adPaused,
  adMuted,
  adFullscreen
})

const mapDispatchToProps = dispatch => ({
  onVideoElementRef: () => {
    dispatch(requestVideoElementUpdate())
  },
  onVpaidIframeLoaded: () => {
    dispatch(requestVpaidDomUpdate())
  },
  onSetAdPaused: value => {
    dispatch(requestAdPaused(value))
  },
  onSetAdMuted: value => {
    dispatch(requestAdMuted(value))
  },
  onSetAdFullscreen: value => {
    dispatch(requestAdFullscreen(value))
  },
  onSkipAd: () => {
    dispatch(requestAdSkip())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer)
