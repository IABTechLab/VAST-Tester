import React from 'react'
import ReactJSONTree from 'react-json-tree'

import baseTheme from '../style/theme'

const theme = {
  extend: baseTheme,
  tree: {
    marginTop: 0,
    marginBottom: 0
  }
}

const valueRenderer = (rendered, raw) =>
  typeof raw === 'string'
    ? (
        raw === ''
          ? (
      <span className="empty">(empty)</span>
            )
          : (
              raw
            )
      )
    : (
        rendered
      )

const JSONTree = props => (
  <ReactJSONTree {...props} theme={theme} valueRenderer={valueRenderer} />
)

export default JSONTree
