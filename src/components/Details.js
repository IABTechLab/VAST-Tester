import React from 'react'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'

import Log from '../containers/Log'
import VastDetails from '../containers/VastDetails'
import VerificationDetails from '../containers/VerificationDetails'
import VideoDetails from '../containers/VideoDetails'
import VpaidDetails from '../containers/VpaidDetails'

const Details = ({ logOnly, vpaidEnabled, verificationEnabled }) => (
  <div className="details">
    <Tabs>
      <TabList>
        <Tab>Log</Tab>
        <Tab disabled={logOnly}>VAST</Tab>
        <Tab disabled={logOnly || !vpaidEnabled}>VPAID</Tab>
        <Tab disabled={logOnly}>Video</Tab>
        <Tab disabled={logOnly || !verificationEnabled}>OMID</Tab>
      </TabList>

      <TabPanel>
        <Log />
      </TabPanel>
      <TabPanel>
        <VastDetails />
      </TabPanel>
      <TabPanel>
        <VpaidDetails />
      </TabPanel>
      <TabPanel>
        <VideoDetails />
      </TabPanel>
      <TabPanel>
        <VerificationDetails />
      </TabPanel>
    </Tabs>
  </div>
)

export default Details
