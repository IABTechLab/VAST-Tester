import React from 'react'
import { connect } from 'react-redux'
import Collapsible from '../components/Collapsible'
import KeyValue from '../components/KeyValue'

const VpaidDetails = ({
  status,
  url,
  adParameters,
  eventCounts,
  properties
}) => (
  <div className='vpaid-details'>
    <Collapsible trigger='VPAID Creative'>
      <div className='vpaid-info'>
        <KeyValue
          data={{
            Status: status,
            URL: url,
            Parameters: adParameters != null ? adParameters : '(none)'
          }}
        />
      </div>
    </Collapsible>
    <Collapsible trigger='VPAID Events'>
      <div className='events'>
        <KeyValue data={eventCounts} />
      </div>
    </Collapsible>
    <Collapsible trigger='VPAID Properties'>
      <div className='properties'>
        <KeyValue data={properties} />
      </div>
    </Collapsible>
  </div>
)

const mapStateToProps = ({
  vpaid: { status, eventCounts, properties },
  vast: { mediaFile: { url }, adParameters }
}) => ({
  status,
  url,
  adParameters,
  eventCounts,
  properties
})

export default connect(mapStateToProps)(VpaidDetails)
