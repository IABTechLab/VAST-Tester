export default class OmidEvent {
  constructor (adSessionId, type, data = {}) {
    this._adSessionId = adSessionId
    this._type = type
    this._timestamp = new Date().getTime()
    this._data = data
  }

  get adSessionId () {
    return this._adSessionId
  }

  get type () {
    return this._type
  }

  get timestamp () {
    return this._timestamp
  }

  get data () {
    return this._data
  }
}
