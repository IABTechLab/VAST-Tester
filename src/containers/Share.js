import fecha from 'fecha'
import { saveAs } from 'file-saver'
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { connect } from 'react-redux'

import Modal from '../components/Modal'
import { stringifyConfig } from '../config'
import { getHistory } from '../middleware/history'
import { APP_VERSION } from '../settings'
import stringify from '../util/stringify'

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
  'vast-tester-' + fecha.format(new Date(), 'YYYY-MM-DD-HH-mm-ss') + '.json'

const onActivateDownloadLog = () => {
  const blob = new Blob([getLogData()], { type: LOG_MIME_TYPE })
  saveAs(blob, getLogFileName())
}

const Share = ({ url }) => (
  <Modal>
    <div className="share">
      <div>Link to this page:</div>
      <div>
        <textarea readOnly value={url} />
      </div>
      <div>
        <CopyToClipboard text={url}>
          <button>Copy to Clipboard</button>
        </CopyToClipboard>
      </div>
      <div className="spacer" />
      <div>Grab a log file for debugging:</div>
      <div>
        <button onClick={onActivateDownloadLog}>Download Log</button>
      </div>
    </div>
  </Modal>
)

const mapStateToProps = ({ config }) => ({
  url: getBaseUrl() + (config != null ? '#/run?' + stringifyConfig(config) : '')
})

export default connect(mapStateToProps)(Share)
