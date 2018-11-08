import React from 'react'
import { connect } from 'react-redux'
import VerificationHost from './VerificationHost'

const VerificationHostList = ({
  verifications,
  adServingId,
  transactionId,
  podSequence,
  adCount
}) => (
  <div className='verification-hosts'>
    {verifications.map((verification, i) => (
      <VerificationHost
        key={i}
        verification={verification}
        adServingId={adServingId}
        transactionId={transactionId}
        podSequence={podSequence}
        adCount={adCount}
      />
    ))}
  </div>
)

const mapStateToProps = ({
  verification: { verifications },
  vast: { inLine }
}) => ({
  verifications,
  adServingId: null, // TODO VAST 4.1
  transactionId: null, // TODO VAST 4.1
  podSequence: inLine != null ? inLine.sequence : null,
  adCount: 1 // TODO Support ad pods
})

export default connect(mapStateToProps)(VerificationHostList)
