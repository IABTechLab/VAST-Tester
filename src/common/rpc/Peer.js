export default class Peer {
  constructor (id, win, target) {
    this._id = id
    this._win = win
    this._target = target || this
  }

  get id () {
    return this._id
  }

  get window () {
    return this._win
  }

  init () {
    this._win.addEventListener('message', event => {
      let data
      try {
        data = JSON.parse(event.data)
      } catch (error) {
        return
      }
      if (data == null || typeof data !== 'object') {
        return
      }
      const { source, action, args } = data
      this._target._received(source, action, args)
    })
  }

  _send (dest, action, args) {
    dest.postMessage(
      JSON.stringify({
        action,
        args,
        source: this._id
      }),
      '*'
    )
  }

  _received (src, action, args) {}
}
