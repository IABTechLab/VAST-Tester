import createAction from '../util/createAction'

export const SET_CONFIG = 'SET_CONFIG'

export const setConfig = config => createAction(SET_CONFIG, config)
