export const VAST_QUARTILE_EVENT_TYPES = [
  'firstQuartile',
  'midpoint',
  'thirdQuartile',
  'complete'
]

export const VAST_EVENT_TYPES = [
  'loaded',
  'start',
  'impression',
  'creativeView',
  ...VAST_QUARTILE_EVENT_TYPES,
  'pause',
  'resume',
  'skip',
  'clickThrough',
  'error'
]
