export const OMID_AD_METRIC_EVENT_TYPES = ['impression', 'geometryChange']

export const OMID_VIDEO_LIFECYCLE_EVENT_TYPES = [
  'loaded',
  'start',
  'firstQuartile',
  'midpoint',
  'thirdQuartile',
  'complete',
  'pause',
  'resume',
  'bufferStart',
  'bufferFinish',
  'skipped',
  'volumeChange',
  'playerStateChange',
  'adUserInteraction'
]

export const OMID_EVENT_TYPES = [
  ...OMID_AD_METRIC_EVENT_TYPES,
  ...OMID_VIDEO_LIFECYCLE_EVENT_TYPES
]
