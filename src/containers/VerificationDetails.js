import React from 'react'
import { connect } from 'react-redux'

import Collapsible from '../components/Collapsible'
import KeyValue from '../components/KeyValue'

const VerificationDetails = React.memo(
  ({ accessMode, scripts, eventCounts }) => (
    <div className="verification-details">
      <Collapsible trigger="Open Measurement Events">
        <div className="events">
          <KeyValue data={eventCounts} />
        </div>
      </Collapsible>
      {scripts.map(({ uri, vendor, verificationParameters }, i) => (
        <Collapsible trigger={`Open Measurement Script #${i + 1}`} key={i}>
          <div className="properties">
            <KeyValue
              data={{
                Vendor: vendor,
                URL: uri,
                Parameters:
                  verificationParameters != null
                    ? verificationParameters
                    : '(none)',
                'Access Mode': accessMode
              }}
            />
          </div>
        </Collapsible>
      ))}
    </div>
  )
)

const mapStateToProps = ({
  verification: { accessMode, scripts, eventCounts }
}) => ({
  accessMode,
  scripts,
  eventCounts
})

export default connect(mapStateToProps)(VerificationDetails)
