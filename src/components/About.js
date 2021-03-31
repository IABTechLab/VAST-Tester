import React from 'react'

import {
  APP_BRANCH,
  APP_BUILD_DATE,
  APP_NAME,
  APP_VENDOR,
  APP_VERSION
} from '../settings'
import Modal from './Modal'

const About = () => (
  <Modal>
    <div className="about">
      <div className="title">
        {APP_VENDOR} {APP_NAME}
      </div>
      <div>
        Version {APP_VERSION} {APP_BRANCH != null && ` (${APP_BRANCH} branch)`}
      </div>
      {APP_BUILD_DATE != null && <div>Built {APP_BUILD_DATE}</div>}
      <div className="spacer" />
      <div>Contributed with</div>
      <div className="heart">
        <div className="heart-inner" />
      </div>
      <div>
        by the{' '}
        <a
          href="https://www.doubleverify.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          DoubleVerify
        </a>{' '}
        team
      </div>
    </div>
  </Modal>
)

export default About
