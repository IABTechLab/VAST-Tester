import _debug from 'debug'
import defer from 'p-defer'
import Peer from './Peer'
import Receiver from './Receiver'
import noop from '../util/noop'

const debug = _debug('rpc:Server')

class ClientStub extends Receiver {
  constructor (server, id, target) {
    super(target)
    this._server = server
    this._id = id
    this._window = null
    this._registering = defer()
    this._registering.promise.catch(noop)
    this.receive('register').then(() => {
      this._registering.resolve()
    })
  }

  get id () {
    return this._id
  }

  get window () {
    return this._window
  }

  set window (win) {
    this._window = win
  }

  get ready () {
    return this._registering.promise
  }

  dispose () {
    this._server.removeClient(this)
    this._registering.reject(new Error('Disposed'))
  }

  send (action, args = {}) {
    debug('send', { id: this._id, action, args })
    this._server._send(this._window, action, args)
  }
}

export default class Server extends Peer {
  constructor (win) {
    super(0, win)
    this._idCount = 0
    this._clients = {}
  }

  reset () {
    for (const id of Object.keys(this._clients)) {
      this._clients[id].dispose()
    }
    this._clients = {}
  }

  addClient (target = null) {
    this._idCount++
    const client = new ClientStub(this, this._idCount, target)
    this._clients[this._idCount] = client
    return client
  }

  getClient (id) {
    return this._clients[id]
  }

  removeClient (client) {
    delete this._clients[client.id]
  }

  broadcast (action, args = {}) {
    for (const id of Object.keys(this._clients)) {
      const client = this._clients[id]
      if (client.window != null) {
        client.send(action, args)
      }
    }
  }

  _received (source, action, args) {
    debug('receive', { source, action, args })
    const client = this._clients[source]
    if (client != null) {
      client._received(action, args)
    }
  }
}
