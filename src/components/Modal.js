import React from 'react'
import FontAwesome from 'react-fontawesome'
import { withRouter } from 'react-router'

const Modal = ({ history, children }) => (
  <div className="modal">
    {children}
    <nav>
      <ul>
        <li>
          <button
            onClick={() => {
              if (history.length > 1) {
                history.goBack()
              } else {
                history.push('/')
              }
            }}
          >
            <FontAwesome name="close" /> Close
          </button>
        </li>
      </ul>
    </nav>
  </div>
)

export default withRouter(Modal)
