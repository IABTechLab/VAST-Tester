import { serializeError } from 'serialize-error'
import stringify from './stringify'

const errorToString = error => {
  const raw = serializeError(error)
  return raw == null
    ? '(unknown error)'
    : typeof raw === 'string'
      ? raw
      : typeof raw === 'object' && raw.message != null
        ? raw.message
        : stringify(raw)
}

export default errorToString
