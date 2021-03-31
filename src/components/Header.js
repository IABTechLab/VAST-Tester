import React from 'react'
import FontAwesome from 'react-fontawesome'
import { Link } from 'react-router-dom'

import { APP_NAME } from '../settings'

const Header = React.memo(({ onActivateCopyLink, onActivateAbout }) => (
  <header>
    <h1>
      <span className="before" />
      <span className="title">{APP_NAME}</span>
    </h1>
    <nav>
      <ul>
        <li>
          <Link to="/share" title="Share Link">
            <FontAwesome name="share-alt" />
          </Link>
        </li>
        <li>
          <a
            href="https://github.com/InteractiveAdvertisingBureau/VAST-Tester"
            target="_blank"
            rel="noopener noreferrer"
            title="Fork on GitHub"
          >
            <FontAwesome name="github-alt" />
          </a>
        </li>
        <li>
          <Link to="/about" title="About">
            <FontAwesome name="info" />
          </Link>
        </li>
      </ul>
    </nav>
  </header>
))

export default Header
