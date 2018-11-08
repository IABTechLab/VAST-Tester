import _debug from 'debug'
import Peer from './Peer'
import Receiver from './Receiver'

const debug = _debug('rpc:Client')

export default class Client {
  constructor (id, win) {
    this._peer = new Peer(id, win, this)
    this._receiver = new Receiver(this)
  }

  get id () {
    return this._peer.id
  }

  get window () {
    return this._peer.window
  }

  init () {
    this._peer.init()
    this.send('register')
  }

  send (action, args = {}) {
    debug('send', { id: this.id, action, args })
    this._peer._send(this.window.parent, action, args)
  }

  receive (action) {
    return this._receiver.receive(action)
  }

  _received (src, action, args) {
    debug('receive', { src, action, args })
    this._receiver._received(action, args)
  }
}
