import React from 'react'
import Toggle from 'react-toggle'

let counter = 0

const Checkbox = ({ label, defaultValue, onChange }) => {
  const id = 'checkbox-' + ++counter
  return (
    <div className='form-group form-group-checkbox'>
      <label htmlFor={id}>{label}</label>
      <Toggle
        id={id}
        icons={false}
        defaultChecked={defaultValue}
        onChange={evt => onChange(evt.target.checked)}
      />
    </div>
  )
}

export default Checkbox
