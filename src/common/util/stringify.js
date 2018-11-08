import toJSON from './toJSON'

const stringify = obj =>
  typeof obj === 'string' ? obj : JSON.stringify(toJSON(obj), null, 2)

export default stringify
