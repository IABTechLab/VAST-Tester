import React from 'react'
import Modal from './Modal'
import {
  APP_VENDOR,
  APP_NAME,
  APP_VERSION,
  APP_BUILD_DATE
} from '../../common/settings'

const About = () => (
  <Modal>
    <div className='about'>
      <div className='title'>
        {APP_VENDOR} {APP_NAME}
      </div>
      <div>Version {APP_VERSION}</div>
      {APP_BUILD_DATE != null ? <div>Built {APP_BUILD_DATE}</div> : null}
      <div className='spacer' />
      <div>Contributed with</div>
      <div className='heart'>
        <div className='heart-inner' />
      </div>
      <div>
        by the{' '}
        <a
          href='https://www.zentrick.com/'
          target='_blank'
          rel='noopener noreferrer'
        >
          Zentrick
        </a>{' '}
        team
      </div>
    </div>
  </Modal>
)

export default About
