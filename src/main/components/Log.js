import React from 'react'
import moment from 'moment'
import FontAwesome from 'react-fontawesome'
import KeyValue from './KeyValue'
import Placeholder from './Placeholder'
import msToString from '../../common/util/msToString'
import stringify from '../../common/util/stringify'

const LEVEL_TO_ICON = {
  info: 'info',
  warn: 'exclamation-triangle',
  error: 'times'
}

const LogItem = ({
  timestamp,
  timeDelta,
  timeTotal,
  level,
  category,
  text,
  metadata
}) => {
  const classNames = `level-${level} category-${category.toLowerCase()}`
  const timeTooltip =
    timeDelta >= 0
      ? `Elapsed: ${msToString(timeDelta)} since previous, ${msToString(
        timeTotal
      )} total`
      : null
  const textWithMetadata =
    metadata == null ? (
      text
    ) : (
      <React.Fragment>
        {text}
        <div className='metadata'>
          <KeyValue data={metadata} serializer={stringify} />
        </div>
      </React.Fragment>
    )
  return (
    <React.Fragment>
      <tr className={`${classNames} first`}>
        <td className='time' title={timeTooltip}>
          {moment(timestamp).format('HH:mm:ss.SSS')}
        </td>
        <td className='level'>
          <span className='icon'>
            <FontAwesome name={LEVEL_TO_ICON[level]} />
          </span>
          <span className='label'>{level}</span>
        </td>
        <td className='category'>{category}</td>
        <td className='text'>{textWithMetadata}</td>
      </tr>
      <tr className={`${classNames} second`}>
        <td className='category'>{category}</td>
        <td className='text' colSpan='3'>
          {textWithMetadata}
        </td>
      </tr>
    </React.Fragment>
  )
}

const Log = ({ dispatch, events }) => {
  if (events.length === 0) {
    return <Placeholder>No log items to show</Placeholder>
  }
  const startTime = events[0].timestamp
  return (
    <div className='log'>
      <table>
        <tbody>
          {events
            .map(({ timestamp, level, category, text, metadata }, i) => (
              <LogItem
                key={i}
                timestamp={timestamp}
                timeDelta={i > 0 ? timestamp - events[i - 1].timestamp : -1}
                timeTotal={timestamp - startTime}
                level={level}
                category={category}
                text={text}
                metadata={metadata}
              />
            ))
            .reverse()}
        </tbody>
      </table>
    </div>
  )
}

export default Log
