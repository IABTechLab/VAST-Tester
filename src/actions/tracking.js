import createAction from '../util/createAction'

export const VAST_TRACKER = 'VAST_TRACKER'

export const vastTrackerFired = (type, uri) =>
  createAction(VAST_TRACKER, { type, uri })
