import React from 'react'

const Fieldset = ({ legend, children, className }) => (
  <fieldset className={className}>
    <legend>{legend}</legend>
    {children}
  </fieldset>
)

export default Fieldset
