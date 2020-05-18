import React from 'react'
import { withRouter } from 'react-router'
import FontAwesome from 'react-fontawesome'

const Modal = ({ history, children }) => (
  <div className='modal'>
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
            <FontAwesome name='close' /> Close
          </button>
        </li>
      </ul>
    </nav>
  </div>
)

export default withRouter(Modal)
