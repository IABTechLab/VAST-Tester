import React from 'react'
import TextArea from 'react-expanding-textarea'

let counter = 0

const TextInput = React.memo(({ label, defaultValue, onChange }) => {
  const id = 'text-input-' + ++counter
  return (
    <div className='form-group form-group-input'>
      {label != null ? <label htmlFor={id}>{label}</label> : null}
      <TextArea
        id={id}
        defaultValue={defaultValue}
        className={'expanding'}
        onChange={evt => onChange(evt.target.value)}
      />
    </div>
  )
})

export default TextInput
