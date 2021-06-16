import createAction from '../util/createAction'

export const START_TEST = 'START_TEST'
export const END_TEST = 'END_TEST'

export const startTest = omAccessMode =>
  createAction(START_TEST, {
    omAccessMode
  })

export const endTest = () => createAction(END_TEST)
