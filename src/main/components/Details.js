import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import VastDetails from '../containers/VastDetails'
import VpaidDetails from '../containers/VpaidDetails'
import VideoDetails from '../containers/VideoDetails'
import VerificationDetails from '../containers/VerificationDetails'
import Log from '../containers/Log'

const Details = ({ logOnly, vpaidEnabled, omidEnabled }) => (
  <div className='details'>
    <Tabs>
      <TabList>
        <Tab>Log</Tab>
        <Tab disabled={logOnly}>VAST</Tab>
        <Tab disabled={logOnly || !vpaidEnabled}>VPAID</Tab>
        <Tab disabled={logOnly}>Video</Tab>
        <Tab disabled={logOnly || !omidEnabled}>OMID</Tab>
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
