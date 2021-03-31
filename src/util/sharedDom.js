let vpaidIframe = null
let videoElement = null
let slotElement = null

const sharedDom = {
  get vpaidIframe () {
    return vpaidIframe
  },

  set vpaidIframe (el) {
    vpaidIframe = el
  },

  get videoElement () {
    return videoElement
  },

  set videoElement (el) {
    videoElement = el
  },

  get slotElement () {
    return slotElement
  },

  set slotElement (el) {
    slotElement = el
  }
}

export default sharedDom
