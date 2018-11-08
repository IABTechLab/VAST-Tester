import React from 'react'

const Placeholder = ({ className, children } = { className: '' }) => (
  <div className={`placeholder ${className}`}>{children}</div>
)

export default Placeholder
