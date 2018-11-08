import React from 'react'

const KeyValue = ({ data, sort, nowrap, serializer }) => {
  const keys = Object.keys(data)
  if (sort) {
    keys.sort()
  }
  const wrapClass = nowrap ? 'kv-nowrap' : 'kv-wrap'
  return (
    <dl className='kv'>
      {keys.map(key => {
        const cssKey = key.replace(/ /g, ' ')
        const value = data[key]
        const type = typeof value
        const valueStr = serializer != null ? serializer(value) : '' + value
        const title = `${key}: ${valueStr}`
        return (
          <React.Fragment key={key}>
            <dt
              className={`kv-${cssKey}-key kv-type-${type}-key ${wrapClass}`}
              title={title}
              data-key={key}
              data-value={valueStr}
            >
              <span>{key}</span>
            </dt>
            <dd
              className={`kv-${cssKey}-value kv-type-${type}-value ${wrapClass}`}
              title={title}
              data-key={key}
              data-value={valueStr}
            >
              <span>{valueStr}</span>
            </dd>
          </React.Fragment>
        )
      })}
    </dl>
  )
}

export default KeyValue
