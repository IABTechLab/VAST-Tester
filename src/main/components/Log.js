import React from 'react'
import fecha from 'fecha'
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

class LogItem extends React.PureComponent {
  render () {
    const {
      timestamp,
      timeDelta,
      timeTotal,
      level,
      category,
      text,
      metadata
    } = this.props
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
        <>
          {text}
          <div className='metadata'>
            <KeyValue data={metadata} serializer={stringify} />
          </div>
        </>
      )
    return (
      <>
        <tr className={`${classNames} first`}>
          <td className='time' title={timeTooltip}>
            {fecha.format(timestamp, 'HH:mm:ss.SSS')}
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
      </>
    )
  }
}

class Log extends React.PureComponent {
  constructor (props) {
    super(props)
    this._containerRef = React.createRef()
  }

  getSnapshotBeforeUpdate (prevProps) {
    if (prevProps.events.length === this.props.events.length) {
      return false
    }
    const container = this._containerRef.current
    const parent = container.parentNode
    return parent.scrollTop + parent.clientHeight === parent.scrollHeight
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (snapshot) {
      const container = this._containerRef.current
      container.querySelector('.last').scrollIntoView()
    }
  }

  render () {
    const { events } = this.props
    if (events.length === 0) {
      return <Placeholder>No log items to show</Placeholder>
    }
    const startTime = events[0].timestamp
    return (
      <div className='log' ref={this._containerRef}>
        <table>
          <tbody>
            {events.map(({ timestamp, level, category, text, metadata }, i) => (
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
            ))}
            <tr className='last' />
          </tbody>
        </table>
      </div>
    )
  }
}

export default Log
