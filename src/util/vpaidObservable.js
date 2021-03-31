import { Subject } from 'rxjs'

import { VPAID_EVENT_NAMES } from '../constants/vpaid'

export const INVOKE = 'INVOKE'
export const RETURN_VALUE = 'RETURN_VALUE'
export const EVENT = 'EVENT'

export const invoke = (name, args, allowError = false) => ({
  type: INVOKE,
  payload: {
    name,
    args,
    allowError
  }
})

const returnValue = (name, args, value) => ({
  type: RETURN_VALUE,
  payload: {
    name,
    args,
    value
  }
})

const event = (name, data) => ({
  type: EVENT,
  payload: {
    name,
    data
  }
})

const attemptCall = (vpaid, name, args) => {
  const func = vpaid[name]
  if (typeof func !== 'function') {
    throw new Error(`VPAID ${name} is not a function`)
  }
  return func.apply(vpaid, args)
}

const vpaidObservable = vpaid => {
  const in$ = new Subject()
  const out$ = new Subject()
  in$.subscribe(({ type, payload }) => {
    if (type !== INVOKE) {
      return
    }
    const { name, args, allowError } = payload
    let error = null
    let value = null
    try {
      value = attemptCall(vpaid, name, args)
    } catch (err) {
      error = new Error(`Error calling VPAID ${name}()`)
      error.cause = err
    }
    if (error != null) {
      if (allowError) {
        // TODO Warn in app log (but only the first time?)
        console.warn(error + (error.cause != null ? `: ${error.cause}` : ''))
      } else {
        out$.error(error)
      }
    } else {
      out$.next(returnValue(name, args, value))
    }
  })
  for (const name of VPAID_EVENT_NAMES) {
    const listener = (...data) => {
      out$.next(event(name, data))
    }
    in$.next(invoke('subscribe', [listener, name]))
  }
  return {
    in$,
    out$
  }
}

export default vpaidObservable
