import React from 'react'
import { connect } from 'react-redux'
import Collapsible from '../components/Collapsible'
import KeyValue from '../components/KeyValue'

const stringifiers = {
  TimeRanges: obj =>
    'TimeRanges[' +
    (obj.data.length > 0
      ? ' ' +
        obj.data
          .map(({ start, end }) => '(' + start + ', ' + end + ')')
          .join(', ') +
        ' '
      : '0') +
    ']',
  TextTrackList: obj => `TextTrackList[${obj.data.length}]`
}

const stringifyProperties = properties => {
  const out = {}
  for (const name of Object.keys(properties)) {
    const obj = properties[name]
    out[name] =
      obj != null && obj.$type != null && stringifiers[obj.$type] != null
        ? stringifiers[obj.$type](obj)
        : '' + obj
  }
  return out
}

const VideoDetails = ({ eventCounts, properties }) => (
  <div className='video-details'>
    <Collapsible trigger='Video Events'>
      <div className='events'>
        <KeyValue data={eventCounts} />
      </div>
    </Collapsible>
    <Collapsible trigger='Video Element Properties'>
      <div className='properties'>
        <KeyValue data={stringifyProperties(properties)} />
      </div>
    </Collapsible>
  </div>
)

const mapStateToProps = ({ video }) => video

export default connect(mapStateToProps)(VideoDetails)
