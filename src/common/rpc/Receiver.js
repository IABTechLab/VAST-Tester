import ucfirst from 'upper-case-first'
import defer from '../util/defer'

export default class Receiver {
  constructor (target) {
    this._target = target || this
    this._deferreds = Object.create(null)
  }

  receive (action) {
    if (this._deferreds[action] == null) {
      this._deferreds[action] = []
    }
    const dfd = defer()
    this._deferreds[action].push(dfd)
    return dfd.promise
  }

  _received (action, args) {
    this._resolveReceptionPromises(action, args)
    this._callReceptionHandler(action, args)
  }

  _resolveReceptionPromises (action, args) {
    const dfds = this._deferreds[action]
    if (dfds != null) {
      this._deferreds[action] = null
      for (const dfd of dfds) {
        dfd.resolve(args)
      }
    }
  }

  _callReceptionHandler (action, args) {
    const handler = this._target['handle' + ucfirst(action)]
    if (typeof handler === 'function') {
      handler.call(this._target, args)
    }
  }
}
