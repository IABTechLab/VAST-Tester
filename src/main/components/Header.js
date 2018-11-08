import React from 'react'
import { Link } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'
import { APP_NAME } from '../../common/settings'

const Header = ({ onActivateCopyLink, onActivateAbout }) => (
  <header>
    <h1>
      <span className='before' />
      <span className='title'>{APP_NAME}</span>
    </h1>
    <nav>
      <ul>
        <li>
          <Link to='/share' title='Share Link'>
            <FontAwesome name='share-alt' />
          </Link>
        </li>
        <li>
          <Link to='/about' title='About'>
            <FontAwesome name='info' />
          </Link>
        </li>
      </ul>
    </nav>
  </header>
)

export default Header
