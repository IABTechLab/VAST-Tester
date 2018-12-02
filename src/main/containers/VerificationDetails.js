import React from 'react'
import { connect } from 'react-redux'
import Collapsible from '../components/Collapsible'
import KeyValue from '../components/KeyValue'
import Placeholder from '../components/Placeholder'

const VerificationVendorDetails = React.memo(
  ({
    number,
    verification: { vendor, uri, verificationParameters, accessMode },
    scriptStatus
  }) => (
    <Collapsible trigger={`Script #${number}`}>
      <div className='properties'>
        <KeyValue
          data={{
            Status: scriptStatus,
            Vendor: vendor != null ? vendor : '(unknown)',
            Access: accessMode,
            URL: uri,
            Parameters:
              verificationParameters != null ? verificationParameters : '(none)'
          }}
        />
      </div>
    </Collapsible>
  )
)

const VerificationDetails = React.memo(
  ({ eventCounts, verifications }) =>
    verifications.length === 0 ? (
      <Placeholder>No verification scripts active</Placeholder>
    ) : (
      <div className='verification-details'>
        <Collapsible trigger='OMID Events'>
          <div className='events'>
            <KeyValue data={eventCounts} />
          </div>
        </Collapsible>
        {verifications.map(({ verification, scriptStatus }, i) => (
          <VerificationVendorDetails
            key={i}
            number={i + 1}
            verification={verification}
            scriptStatus={scriptStatus}
          />
        ))}
      </div>
    )
)

const mapStateToProps = ({
  verification: { globalEventCounts, verifications, scriptStatuses }
}) => ({
  eventCounts: globalEventCounts,
  verifications: verifications.map((verification, i) => ({
    verification,
    scriptStatus: scriptStatuses[i]
  }))
})

export default connect(mapStateToProps)(VerificationDetails)
