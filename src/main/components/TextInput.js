import React from 'react'

let counter = 0

const TextInput = ({ label, defaultValue, onChange }) => {
  const id = 'text-input-' + ++counter
  return (
    <div className='form-group form-group-input'>
      {label != null ? <label htmlFor={id}>{label}</label> : null}
      <input
        id={id}
        defaultValue={defaultValue}
        onChange={evt => onChange(evt.target.value)}
      />
    </div>
  )
}

export default TextInput
