import { Server } from '../../common/rpc'
import sharedDom from './sharedDom'

let server = null

const init = () => {
  if (server == null) {
    server = new Server(window)
    server.init()
    window.__sharedDom__ = sharedDom
  }
}

const reset = () => {
  if (server != null) {
    server.reset()
  }
}

const addClient = onEvent => {
  init()
  return server.addClient({
    handleAcceptEvent: onEvent
  })
}

const getClient = id => (server != null ? server.getClient(id) : null)

const broadcast = (action, args = {}) => {
  if (server != null) {
    server.broadcast(action, args)
  }
}

export default {
  reset,
  addClient,
  getClient,
  broadcast
}
