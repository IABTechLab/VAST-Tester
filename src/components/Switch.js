import React from 'react'

const Switch = React.memo(
  ({ label, tooltip, options, defaultValue, onChange }) => {
    return (
      <div className="form-group form-group-switch">
        <label title={tooltip}>{label}</label>
        <div className="switch-options">
          {[...Object.entries(options)].map(([name, label], idx) => (
            <div
              key={idx}
              className={
                'switch-option' + (name === defaultValue ? ' active' : '')
              }
              onClick={() => onChange(name)}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    )
  }
)

export default Switch
