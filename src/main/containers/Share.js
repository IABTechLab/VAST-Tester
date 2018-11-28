import React from 'react'
import { connect } from 'react-redux'
import CopyToClipboard from 'react-copy-to-clipboard'
import { saveAs } from 'file-saver'
import moment from 'moment'
import Modal from '../components/Modal'
import { getHistory } from '../middleware/history'
import { stringifyConfig } from '../util/config'
import stringify from '../../common/util/stringify'
import { APP_VERSION } from '../../common/settings'

const LOG_MIME_TYPE = 'application/json'

const getBaseUrl = () => {
  const { protocol, host, pathname } = window.location
  return `${protocol}//${host}${pathname}`
}

const getLogData = () =>
  stringify({
    version: APP_VERSION,
    history: getHistory()
  })

const getLogFileName = () =>
  'vast-tester-' + moment().format('YYYY-MM-DD-HH-mm-ss') + '.json'

const onActivateDownloadLog = () => {
  const blob = new Blob([getLogData()], { type: LOG_MIME_TYPE })
  saveAs(blob, getLogFileName())
}

const Share = ({ url }) => {
  return (
    <Modal>
      <div className='share'>
        <div>Link to this page:</div>
        <div>
          <textarea readOnly value={url} />
        </div>
        <div>
          <CopyToClipboard text={url}>
            <button>Copy to Clipboard</button>
          </CopyToClipboard>
        </div>
        <div className='spacer' />
        <div>Grab a log file for debugging:</div>
        <div>
          <button onClick={onActivateDownloadLog}>Download Log</button>
        </div>
      </div>
    </Modal>
  )
}

const mapStateToProps = ({ config }) => ({
  url: getBaseUrl() + (config != null ? '#/run?' + stringifyConfig(config) : '')
})

export default connect(mapStateToProps)(Share)
