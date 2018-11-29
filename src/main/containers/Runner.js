import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'
import VideoPlayer from './VideoPlayer'
import VerificationHostList from './VerificationHostList'
import Header from '../components/Header'
import Details from '../components/Details'
import { stringifyConfig } from '../util/config'

const Runner = ({
  location,
  config,
  onApplyConfig,
  vastLoaded,
  mediaFileIsVpaid,
  omidScriptsPresent
}) =>
  config == null ? null : (
    <main className='runner'>
      <Header />
      <div className='contents'>
        <VideoPlayer />
        <VerificationHostList />
        <Details
          logOnly={!vastLoaded}
          vpaidEnabled={mediaFileIsVpaid}
          omidEnabled={omidScriptsPresent}
        />
      </div>
      <div className='actions'>
        <nav>
          <ul>
            <li>
              <Link to={{ pathname: '/', search: stringifyConfig(config) }}>
                <FontAwesome name='arrow-left' /> New Test
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </main>
  )

const mapStateToProps = ({
  config,
  vast: { chain, mediaFile },
  verification: { verifications }
}) => ({
  config,
  vastLoaded: chain != null,
  mediaFileIsVpaid: mediaFile != null && mediaFile.apiFramework === 'VPAID',
  omidScriptsPresent: verifications.length > 0
})

export default connect(mapStateToProps)(Runner)
