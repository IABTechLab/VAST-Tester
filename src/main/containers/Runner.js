import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'
import VideoPlayer from './VideoPlayer'
import VerificationHostList from './VerificationHostList'
import Header from '../components/Header'
import Details from '../components/Details'
import { setConfig } from '../actions'
import { parseConfig, stringifyConfig, configsEqual } from '../util/config'

const Runner = ({
  location,
  config,
  onApplyConfig,
  vastLoaded,
  mediaFileIsVpaid,
  omidScriptsPresent
}) => {
  const newConfig = parseConfig(location.search.substr(1))
  if (!configsEqual(config, newConfig)) {
    onApplyConfig(newConfig)
  }
  return (
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
}

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

const mapDispatchToProps = dispatch => ({
  onApplyConfig: config => {
    dispatch(setConfig(config))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Runner)
