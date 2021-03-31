import React from 'react'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Details from '../components/Details'
import Header from '../components/Header'
import { stringifyConfig } from '../config'
import VideoPlayer from './VideoPlayer'

const Runner = ({
  config,
  vastLoaded,
  mediaFileIsVpaid,
  hasVerificationScripts
}) =>
  config == null
    ? null
    : (
    <main className="runner">
      <Header />
      <div className="contents">
        <VideoPlayer />
        <Details
          logOnly={!vastLoaded}
          vpaidEnabled={mediaFileIsVpaid}
          verificationEnabled={hasVerificationScripts}
        />
      </div>
      <div className="actions">
        <nav>
          <ul>
            <li>
              <Link to={{ pathname: '/', search: stringifyConfig(config) }}>
                <FontAwesome name="arrow-left" /> New Test
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </main>
      )

const mapStateToProps = ({
  config,
  vast: { chain, mediaFile, verifications }
}) => ({
  config,
  vastLoaded: chain != null,
  mediaFileIsVpaid: mediaFile != null && mediaFile.apiFramework === 'VPAID',
  hasVerificationScripts: verifications != null && verifications.length > 0
})

export default connect(mapStateToProps)(Runner)
