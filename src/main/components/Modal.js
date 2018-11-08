import React from 'react'
import { withRouter } from 'react-router'
import FontAwesome from 'react-fontawesome'

const Modal = ({ history, children, onActivateClose }) => (
  <div className='modal'>
    {children}
    <nav>
      <ul>
        <li>
          <a
            onClick={() => {
              if (history.length > 1) {
                history.goBack()
              } else {
                history.push('/')
              }
            }}
          >
            <FontAwesome name='close' /> Close
          </a>
        </li>
      </ul>
    </nav>
  </div>
)

export default withRouter(Modal)
