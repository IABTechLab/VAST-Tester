(function (omidClient) {
  var VENDOR_KEY = 'unknown'

  var EVENT_TYPES = [
    'impression',
    'loaded',
    'start',
    'firstQuartile',
    'midpoint',
    'thirdQuartile',
    'complete',
    'pause',
    'resume',
    'bufferStart',
    'bufferFinish',
    'skipped',
    'volumeChange',
    'playerStateChange',
    'adUserInteraction',
    'geometryChange'
  ]

  if (document.currentScript != null) {
    var scriptUri = document.currentScript.src
    var pos = scriptUri.indexOf('?')
    if (pos >= 0) {
      VENDOR_KEY = scriptUri.substr(pos + 1)
    }
  }

  var logger = {}
  ;['info', 'warn', 'error'].forEach(function (level) {
    logger[level] = function () {
      var args = Array.prototype.slice.call(arguments)
      args[0] = '[OMID ' + VENDOR_KEY + '] ' + args[0]
      console[level].apply(console, args)
    }
  })

  if (omidClient == null) {
    logger.error('OMID API not available')
    return
  }

  var onEvent = function (prefix) {
    return function (evt) {
      logger.info(prefix + ': ' + evt.type + ', data:', evt.data)
    }
  }

  omidClient.registerSessionObserver(onEvent('Session event'), VENDOR_KEY)

  var onLifecycleEvent = onEvent('Lifecycle event')
  for (var i = 0; i < EVENT_TYPES.length; ++i) {
    omidClient.addEventListener(EVENT_TYPES[i], onLifecycleEvent)
  }
})(window.omid3p)
