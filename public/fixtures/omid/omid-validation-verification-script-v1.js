;(function(omidGlobal, factory, exports) {
  // CommonJS support
  if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    factory(omidGlobal, exports);

  // If neither AMD nor CommonJS are used, export to a versioned name in the
  // global context.
  } else {
    var exports = {};
    var versions = ['1.2.7-dev'];
    var additionalVersionString = '';
    if (!!additionalVersionString) {
       versions.push(additionalVersionString);
    }

    factory(omidGlobal, exports);

    function deepFreeze(object) {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          object[key] = deepFreeze(object[key]);
        }
      }
      return Object.freeze(object);
    }

    // Inject and freeze the exported components of omid.
    for (var key in exports) {
      if (exports.hasOwnProperty(key)) {
        if (Object.getOwnPropertyDescriptor(omidGlobal, key) == null) {
          // Define the top level property in the global scope
          Object.defineProperty(omidGlobal, key, {
            value: {},
          });
        }
        versions.forEach((version) => {
          if (Object.getOwnPropertyDescriptor(omidGlobal[key], version) == null) {
            var frozenObject = deepFreeze(exports[key]);
            // Define the object exports keyed-off versions
            Object.defineProperty(omidGlobal[key], version, {
              get: function () {
                return frozenObject;
              },
              enumerable: true,
            });
          }
        });
      }
    }
  }
}(typeof global === 'undefined' ? this : global, function(omidGlobal, omidExports) {
  'use strict';var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  for (var d in b) {
    if ("prototype" != d) {
      if (Object.defineProperties) {
        var e = Object.getOwnPropertyDescriptor(b, d);
        e && Object.defineProperty(a, d, e);
      } else {
        a[d] = b[d];
      }
    }
  }
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  a != Array.prototype && a != Object.prototype && (a[b] = c.value);
};
$jscomp.getGlobal = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(a) {
  return $jscomp.SYMBOL_PREFIX + (a || "") + $jscomp.symbolCounter_++;
};
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.iterator;
  a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
  "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return $jscomp.arrayIterator(this);
  }});
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(a) {
  var b = 0;
  return $jscomp.iteratorPrototype(function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  });
};
$jscomp.iteratorPrototype = function(a) {
  $jscomp.initSymbolIterator();
  a = {next:a};
  a[$jscomp.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
$jscomp.makeIterator = function(a) {
  $jscomp.initSymbolIterator();
  var b = a[Symbol.iterator];
  return b ? b.call(a) : $jscomp.arrayIterator(a);
};
$jscomp.arrayFromIterator = function(a) {
  for (var b, c = []; !(b = a.next()).done;) {
    c.push(b.value);
  }
  return c;
};
$jscomp.arrayFromIterable = function(a) {
  return a instanceof Array ? a : $jscomp.arrayFromIterator($jscomp.makeIterator(a));
};
$jscomp.iteratorFromArray = function(a, b) {
  $jscomp.initSymbolIterator();
  a instanceof String && (a += "");
  var c = 0, d = {next:function() {
    if (c < a.length) {
      var e = c++;
      return {value:b(e, a[e]), done:!1};
    }
    d.next = function() {
      return {done:!0, value:void 0};
    };
    return d.next();
  }};
  d[Symbol.iterator] = function() {
    return d;
  };
  return d;
};
$jscomp.polyfill = function(a, b, c, d) {
  if (b) {
    c = $jscomp.global;
    a = a.split(".");
    for (d = 0; d < a.length - 1; d++) {
      var e = a[d];
      e in c || (c[e] = {});
      c = c[e];
    }
    a = a[a.length - 1];
    d = c[a];
    b = b(d);
    b != d && null != b && $jscomp.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
  }
};
var module$exports$omid$common$argsChecker = {assertTruthyString:function(a, b) {
  if (!b) {
    throw Error("Value for " + a + " is undefined, null or blank.");
  }
  if ("string" !== typeof b && !(b instanceof String)) {
    throw Error("Value for " + a + " is not a string.");
  }
  if ("" === b.trim()) {
    throw Error("Value for " + a + " is empty string.");
  }
}, assertNotNullObject:function(a, b) {
  if (null == b) {
    throw Error("Value for " + a + " is undefined or null");
  }
}, assertNumber:function(a, b) {
  if (null == b) {
    throw Error(a + " must not be null or undefined.");
  }
  if ("number" !== typeof b || isNaN(b)) {
    throw Error("Value for " + a + " is not a number");
  }
}, assertNumberBetween:function(a, b, c, d) {
  (0,module$exports$omid$common$argsChecker.assertNumber)(a, b);
  if (b < c || b > d) {
    throw Error("Value for " + a + " is outside the range [" + c + "," + d + "]");
  }
}, assertFunction:function(a, b) {
  if (!b) {
    throw Error(a + " must not be truthy.");
  }
}, assertPositiveNumber:function(a, b) {
  (0,module$exports$omid$common$argsChecker.assertNumber)(a, b);
  if (0 > b) {
    throw Error(a + " must be a positive number.");
  }
}};
var module$exports$omid$common$VersionUtils = {}, module$contents$omid$common$VersionUtils_SEMVER_DIGITS_NUMBER = 3;
module$exports$omid$common$VersionUtils.isValidVersion = function(a) {
  return /\d+\.\d+\.\d+(-.*)?/.test(a);
};
module$exports$omid$common$VersionUtils.versionGreaterOrEqual = function(a, b) {
  a = a.split("-")[0].split(".");
  b = b.split("-")[0].split(".");
  for (var c = 0; c < module$contents$omid$common$VersionUtils_SEMVER_DIGITS_NUMBER; c++) {
    var d = parseInt(a[c], 10), e = parseInt(b[c], 10);
    if (d > e) {
      break;
    } else {
      if (d < e) {
        return !1;
      }
    }
  }
  return !0;
};
var module$exports$omid$common$ArgsSerDe = {}, module$contents$omid$common$ArgsSerDe_ARGS_NOT_SERIALIZED_VERSION = "1.0.3";
module$exports$omid$common$ArgsSerDe.serializeMessageArgs = function(a, b) {
  return (0,module$exports$omid$common$VersionUtils.isValidVersion)(a) && (0,module$exports$omid$common$VersionUtils.versionGreaterOrEqual)(a, module$contents$omid$common$ArgsSerDe_ARGS_NOT_SERIALIZED_VERSION) ? b : JSON.stringify(b);
};
module$exports$omid$common$ArgsSerDe.deserializeMessageArgs = function(a, b) {
  return (0,module$exports$omid$common$VersionUtils.isValidVersion)(a) && (0,module$exports$omid$common$VersionUtils.versionGreaterOrEqual)(a, module$contents$omid$common$ArgsSerDe_ARGS_NOT_SERIALIZED_VERSION) ? b ? b : [] : b && "string" === typeof b ? JSON.parse(b) : [];
};
var module$exports$omid$common$constants = {AdEventType:{IMPRESSION:"impression", STATE_CHANGE:"stateChange", GEOMETRY_CHANGE:"geometryChange", SESSION_START:"sessionStart", SESSION_ERROR:"sessionError", SESSION_FINISH:"sessionFinish", VIDEO:"video", LOADED:"loaded", START:"start", FIRST_QUARTILE:"firstQuartile", MIDPOINT:"midpoint", THIRD_QUARTILE:"thirdQuartile", COMPLETE:"complete", PAUSE:"pause", RESUME:"resume", BUFFER_START:"bufferStart", BUFFER_FINISH:"bufferFinish", SKIPPED:"skipped", VOLUME_CHANGE:"volumeChange", 
PLAYER_STATE_CHANGE:"playerStateChange", AD_USER_INTERACTION:"adUserInteraction"}, VideoEventType:{LOADED:"loaded", START:"start", FIRST_QUARTILE:"firstQuartile", MIDPOINT:"midpoint", THIRD_QUARTILE:"thirdQuartile", COMPLETE:"complete", PAUSE:"pause", RESUME:"resume", BUFFER_START:"bufferStart", BUFFER_FINISH:"bufferFinish", SKIPPED:"skipped", VOLUME_CHANGE:"volumeChange", PLAYER_STATE_CHANGE:"playerStateChange", AD_USER_INTERACTION:"adUserInteraction"}, ErrorType:{GENERIC:"generic", VIDEO:"video"}, 
AdSessionType:{NATIVE:"native", HTML:"html"}, EventOwner:{NATIVE:"native", JAVASCRIPT:"javascript", NONE:"none"}, AccessMode:{FULL:"full", LIMITED:"limited"}, AppState:{BACKGROUNDED:"backgrounded", FOREGROUNDED:"foregrounded"}, Environment:{MOBILE:"app"}, InteractionType:{CLICK:"click", INVITATION_ACCEPT:"invitationAccept"}, MediaType:{DISPLAY:"display", VIDEO:"video"}, Reason:{NOT_FOUND:"notFound", HIDDEN:"hidden", BACKGROUNDED:"backgrounded", VIEWPORT:"viewport", OBSTRUCTED:"obstructed", CLIPPED:"clipped"}, 
SupportedFeatures:{CONTAINER:"clid", VIDEO:"vlid"}, VideoPosition:{PREROLL:"preroll", MIDROLL:"midroll", POSTROLL:"postroll", STANDALONE:"standalone"}, VideoPlayerState:{MINIMIZED:"minimized", COLLAPSED:"collapsed", NORMAL:"normal", EXPANDED:"expanded", FULLSCREEN:"fullscreen"}, NativeViewKeys:{X:"x", LEFT:"left", Y:"y", TOP:"top", WIDTH:"width", HEIGHT:"height", AD_SESSION_ID:"adSessionId", IS_FRIENDLY_OBSTRUCTION_FOR:"isFriendlyObstructionFor", CLIPS_TO_BOUNDS:"clipsToBounds", CHILD_VIEWS:"childViews", 
END_X:"endX", END_Y:"endY", OBSTRUCTIONS:"obstructions"}, MeasurementStateChangeSource:{CONTAINER:"container", CREATIVE:"creative"}, ElementMarkup:{OMID_ELEMENT_CLASS_NAME:"omid-element"}, CommunicationType:{NONE:"NONE", DIRECT:"DIRECT", POST_MESSAGE:"POST_MESSAGE"}, OmidImplementer:{OMSDK:"omsdk"}};
var module$contents$omid$common$InternalMessage_GUID_KEY = "omid_message_guid", module$contents$omid$common$InternalMessage_METHOD_KEY = "omid_message_method", module$contents$omid$common$InternalMessage_VERSION_KEY = "omid_message_version", module$contents$omid$common$InternalMessage_ARGS_KEY = "omid_message_args", module$exports$omid$common$InternalMessage = function(a, b, c, d) {
  this.guid = a;
  this.method = b;
  this.version = c;
  this.args = d;
};
module$exports$omid$common$InternalMessage.isValidSerializedMessage = function(a) {
  return !!a && void 0 !== a[module$contents$omid$common$InternalMessage_GUID_KEY] && void 0 !== a[module$contents$omid$common$InternalMessage_METHOD_KEY] && void 0 !== a[module$contents$omid$common$InternalMessage_VERSION_KEY] && "string" === typeof a[module$contents$omid$common$InternalMessage_GUID_KEY] && "string" === typeof a[module$contents$omid$common$InternalMessage_METHOD_KEY] && "string" === typeof a[module$contents$omid$common$InternalMessage_VERSION_KEY] && (void 0 === a[module$contents$omid$common$InternalMessage_ARGS_KEY] || 
  void 0 !== a[module$contents$omid$common$InternalMessage_ARGS_KEY]);
};
module$exports$omid$common$InternalMessage.deserialize = function(a) {
  return new module$exports$omid$common$InternalMessage(a[module$contents$omid$common$InternalMessage_GUID_KEY], a[module$contents$omid$common$InternalMessage_METHOD_KEY], a[module$contents$omid$common$InternalMessage_VERSION_KEY], a[module$contents$omid$common$InternalMessage_ARGS_KEY]);
};
module$exports$omid$common$InternalMessage.prototype.serialize = function() {
  var a = {};
  a = (a[module$contents$omid$common$InternalMessage_GUID_KEY] = this.guid, a[module$contents$omid$common$InternalMessage_METHOD_KEY] = this.method, a[module$contents$omid$common$InternalMessage_VERSION_KEY] = this.version, a);
  void 0 !== this.args && (a[module$contents$omid$common$InternalMessage_ARGS_KEY] = this.args);
  return a;
};
var module$exports$omid$common$Communication = function(a) {
  this.to = a;
  this.communicationType_ = module$exports$omid$common$constants.CommunicationType.NONE;
};
module$exports$omid$common$Communication.prototype.sendMessage = function(a, b) {
};
module$exports$omid$common$Communication.prototype.handleMessage = function(a, b) {
  if (this.onMessage) {
    this.onMessage(a, b);
  }
};
module$exports$omid$common$Communication.prototype.generateGuid = function() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
    var b = 16 * Math.random() | 0;
    a = "y" === a ? (b & 3 | 8).toString(16) : b.toString(16);
    return a;
  });
};
module$exports$omid$common$Communication.prototype.serialize = function(a) {
  return JSON.stringify(a);
};
module$exports$omid$common$Communication.prototype.deserialize = function(a) {
  return JSON.parse(a);
};
module$exports$omid$common$Communication.prototype.isDirectCommunication = function() {
  return this.communicationType_ === module$exports$omid$common$constants.CommunicationType.DIRECT;
};
var module$exports$omid$common$DetectOmid = {OMID_PRESENT_FRAME_NAME:"omid_v1_present", isOmidPresent:function(a) {
  try {
    return a.frames ? !!a.frames[module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME] : !1;
  } catch (b) {
    return !1;
  }
}, declareOmidPresence:function(a) {
  a.frames && a.document && (module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME in a.frames || (null == a.document.body && module$exports$omid$common$DetectOmid.isMutationObserverAvailable_(a) ? module$exports$omid$common$DetectOmid.registerMutationObserver_(a) : a.document.body ? module$exports$omid$common$DetectOmid.appendPresenceIframe_(a) : a.document.write('<iframe style="display:none" ' + ('id="' + module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME + '"') + (' name="' + 
  module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME + '">') + "</iframe>")));
}, appendPresenceIframe_:function(a) {
  var b = a.document.createElement("iframe");
  b.id = module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME;
  b.name = module$exports$omid$common$DetectOmid.OMID_PRESENT_FRAME_NAME;
  b.style.display = "none";
  a.document.body.appendChild(b);
}, isMutationObserverAvailable_:function(a) {
  return "MutationObserver" in a;
}, registerMutationObserver_:function(a) {
  var b = new MutationObserver(function(c) {
    c.forEach(function(c) {
      "BODY" === c.addedNodes[0].nodeName && (module$exports$omid$common$DetectOmid.appendPresenceIframe_(a), b.disconnect());
    });
  });
  b.observe(a.document.documentElement, {childList:!0});
}};
var module$exports$omid$common$DirectCommunication = function(a) {
  module$exports$omid$common$Communication.call(this, a);
  this.communicationType_ = module$exports$omid$common$constants.CommunicationType.DIRECT;
  this.handleExportedMessage = module$exports$omid$common$DirectCommunication.prototype.handleExportedMessage.bind(this);
};
$jscomp.inherits(module$exports$omid$common$DirectCommunication, module$exports$omid$common$Communication);
module$exports$omid$common$DirectCommunication.prototype.sendMessage = function(a, b) {
  b = void 0 === b ? this.to : b;
  if (!b) {
    throw Error("Message destination must be defined at construction time or when sending the message.");
  }
  b.handleExportedMessage(a.serialize(), this);
};
module$exports$omid$common$DirectCommunication.prototype.handleExportedMessage = function(a, b) {
  module$exports$omid$common$InternalMessage.isValidSerializedMessage(a) && this.handleMessage(module$exports$omid$common$InternalMessage.deserialize(a), b);
};
var module$exports$omid$common$eventTypedefs = {};
var module$exports$omid$common$exporter = {};
function module$contents$omid$common$exporter_getOmidExports() {
  return "undefined" === typeof omidExports ? null : omidExports;
}
function module$contents$omid$common$exporter_getOrCreateName(a, b) {
  return a && (a[b] || (a[b] = {}));
}
module$exports$omid$common$exporter.packageExport = function(a, b, c) {
  if (c = void 0 === c ? module$contents$omid$common$exporter_getOmidExports() : c) {
    a = a.split("."), a.slice(0, a.length - 1).reduce(module$contents$omid$common$exporter_getOrCreateName, c)[a[a.length - 1]] = b;
  }
};
var module$exports$omid$common$logger = {error:function(a) {
  for (var b = [], c = 0; c < arguments.length; ++c) {
    b[c - 0] = arguments[c];
  }
  module$contents$omid$common$logger_executeLog(function() {
    throw new (Function.prototype.bind.apply(Error, [null].concat(["Could not complete the test successfully - "], $jscomp.arrayFromIterable(b))));
  }, function() {
    return console.error.apply(console, [].concat($jscomp.arrayFromIterable(b)));
  });
}, debug:function(a) {
  for (var b = [], c = 0; c < arguments.length; ++c) {
    b[c - 0] = arguments[c];
  }
  module$contents$omid$common$logger_executeLog(function() {
  }, function() {
    return console.error.apply(console, [].concat($jscomp.arrayFromIterable(b)));
  });
}};
function module$contents$omid$common$logger_executeLog(a, b) {
  "undefined" !== typeof jasmine && jasmine ? a() : "undefined" !== typeof console && console && console.error && b();
}
;var module$exports$omid$common$OmidGlobalProvider = {}, module$contents$omid$common$OmidGlobalProvider_globalThis = eval("this");
function module$contents$omid$common$OmidGlobalProvider_getOmidGlobal() {
  if ("undefined" !== typeof omidGlobal && omidGlobal) {
    return omidGlobal;
  }
  if ("undefined" !== typeof global && global) {
    return global;
  }
  if ("undefined" !== typeof window && window) {
    return window;
  }
  if ("undefined" !== typeof module$contents$omid$common$OmidGlobalProvider_globalThis && module$contents$omid$common$OmidGlobalProvider_globalThis) {
    return module$contents$omid$common$OmidGlobalProvider_globalThis;
  }
  throw Error("Could not determine global object context.");
}
module$exports$omid$common$OmidGlobalProvider.omidGlobal = module$contents$omid$common$OmidGlobalProvider_getOmidGlobal();
var module$exports$omid$common$PostMessageCommunication = function(a, b) {
  b = void 0 === b ? module$exports$omid$common$OmidGlobalProvider.omidGlobal : b;
  module$exports$omid$common$Communication.call(this, b);
  var c = this;
  this.communicationType_ = module$exports$omid$common$constants.CommunicationType.POST_MESSAGE;
  a.addEventListener("message", function(a) {
    if ("object" === typeof a.data) {
      var b = a.data;
      module$exports$omid$common$InternalMessage.isValidSerializedMessage(b) && (b = module$exports$omid$common$InternalMessage.deserialize(b), a.source && c.handleMessage(b, a.source));
    }
  });
};
$jscomp.inherits(module$exports$omid$common$PostMessageCommunication, module$exports$omid$common$Communication);
module$exports$omid$common$PostMessageCommunication.isCompatibleContext = function(a) {
  return !!(a && a.addEventListener && a.postMessage);
};
module$exports$omid$common$PostMessageCommunication.prototype.sendMessage = function(a, b) {
  b = void 0 === b ? this.to : b;
  if (!b) {
    throw Error("Message destination must be defined at construction time or when sending the message.");
  }
  b.postMessage(a.serialize(), "*");
};
var module$exports$omid$common$Rectangle = function(a, b, c, d) {
  this.x = a;
  this.y = b;
  this.width = c;
  this.height = d;
};
var module$exports$omid$common$serviceCommunication = {resolveTopWindowContext:function(a) {
  "undefined" === typeof a && "undefined" !== typeof window && window && (a = window);
  if ("undefined" === typeof a || !a || "undefined" === typeof a.top || !a.top) {
    return module$exports$omid$common$OmidGlobalProvider.omidGlobal;
  }
  if (a === a.top) {
    return a;
  }
  try {
    return "undefined" === typeof a.top.location.hostname ? a : a.top;
  } catch (b) {
    return a;
  }
}};
function module$contents$omid$common$serviceCommunication_getUnobfuscatedKey(a, b) {
  return b.reduce(function(a, b) {
    return a && a[b];
  }, a);
}
module$exports$omid$common$serviceCommunication.startServiceCommunication = function(a, b, c) {
  c = void 0 === c ? module$exports$omid$common$DetectOmid.isOmidPresent : c;
  return (b = module$contents$omid$common$serviceCommunication_getUnobfuscatedKey(a, b)) ? new module$exports$omid$common$DirectCommunication(b) : a.top && c(a.top) ? new module$exports$omid$common$PostMessageCommunication(a, a.top) : null;
};
var module$exports$omid$common$VastProperties = function(a, b, c, d) {
  this.isSkippable = a;
  this.skipOffset = b;
  this.isAutoPlay = c;
  this.position = d;
};
var module$exports$omid$common$version = {ApiVersion:"1.0", Version:"1.2.7-dev"};
var module$contents$omid$verificationClient$VerificationClient_VERIFICATION_CLIENT_VERSION = module$exports$omid$common$version.Version, module$contents$omid$verificationClient$VerificationClient_EventCallback;
function module$contents$omid$verificationClient$VerificationClient_getThirdPartyOmid() {
  var a = module$exports$omid$common$OmidGlobalProvider.omidGlobal.omid3p;
  return a && "function" === typeof a.registerSessionObserver && "function" === typeof a.addEventListener ? a : null;
}
var module$exports$omid$verificationClient$VerificationClient = function(a) {
  if (this.communication = a = void 0 === a ? (0,module$exports$omid$common$serviceCommunication.startServiceCommunication)((0,module$exports$omid$common$serviceCommunication.resolveTopWindowContext)(), ["omid", "v1_VerificationServiceCommunication"]) : a) {
    this.communication.onMessage = this.handleMessage_.bind(this);
  } else {
    if (a = module$contents$omid$verificationClient$VerificationClient_getThirdPartyOmid()) {
      this.omid3p = a;
    }
  }
  this.remoteIntervals_ = this.remoteTimeouts_ = 0;
  this.callbackMap_ = {};
  this.imgCache_ = [];
};
module$exports$omid$verificationClient$VerificationClient.prototype.isSupported = function() {
  return !(!this.communication && !this.omid3p);
};
module$exports$omid$verificationClient$VerificationClient.prototype.registerSessionObserver = function(a, b) {
  (0,module$exports$omid$common$argsChecker.assertFunction)("functionToExecute", a);
  this.omid3p ? this.omid3p.registerSessionObserver(a, b) : this.sendMessage_("addSessionListener", a, b);
};
module$exports$omid$verificationClient$VerificationClient.prototype.addEventListener = function(a, b) {
  (0,module$exports$omid$common$argsChecker.assertTruthyString)("eventType", a);
  (0,module$exports$omid$common$argsChecker.assertFunction)("functionToExecute", b);
  this.omid3p ? this.omid3p.addEventListener(a, b) : this.sendMessage_("addEventListener", b, a);
};
module$exports$omid$verificationClient$VerificationClient.prototype.sendUrl = function(a, b, c) {
  (0,module$exports$omid$common$argsChecker.assertTruthyString)("url", a);
  module$exports$omid$common$OmidGlobalProvider.omidGlobal.document && module$exports$omid$common$OmidGlobalProvider.omidGlobal.document.createElement ? this.sendUrlWithImg_(a, b, c) : this.sendMessage_("sendUrl", function(a) {
    a && b ? b() : !a && c && c();
  }, a);
};
module$exports$omid$verificationClient$VerificationClient.prototype.sendUrlWithImg_ = function(a, b, c) {
  var d = this, e = module$exports$omid$common$OmidGlobalProvider.omidGlobal.document.createElement("img");
  this.imgCache_.push(e);
  var f = function(a) {
    var b = d.imgCache_.indexOf(e);
    0 <= b && d.imgCache_.splice(b, 1);
    a && a();
  };
  e.addEventListener("load", f.bind(this, b));
  e.addEventListener("error", f.bind(this, c));
  e.src = a;
};
module$exports$omid$verificationClient$VerificationClient.prototype.injectJavaScriptResource = function(a, b, c) {
  var d = this;
  (0,module$exports$omid$common$argsChecker.assertTruthyString)("url", a);
  module$exports$omid$common$OmidGlobalProvider.omidGlobal.document ? this.injectJavascriptResourceUrlInDom_(a, b, c) : this.sendMessage_("injectJavaScriptResource", function(e, f) {
    e ? (d.evaluateJavaScript_(f, a), b()) : (module$exports$omid$common$logger.error("Service failed to load JavaScript resource."), c());
  }, a);
};
module$exports$omid$verificationClient$VerificationClient.prototype.injectJavascriptResourceUrlInDom_ = function(a, b, c) {
  var d = module$exports$omid$common$OmidGlobalProvider.omidGlobal.document, e = d.body;
  d = d.createElement("script");
  d.onload = b;
  d.onerror = c;
  d.src = a;
  d.type = "application/javascript";
  e.appendChild(d);
};
module$exports$omid$verificationClient$VerificationClient.prototype.evaluateJavaScript_ = function(a, b) {
  try {
    eval(a);
  } catch (c) {
    module$exports$omid$common$logger.error('Error evaluating the JavaScript resource from "' + b + '".');
  }
};
module$exports$omid$verificationClient$VerificationClient.prototype.setTimeout = function(a, b) {
  (0,module$exports$omid$common$argsChecker.assertFunction)("functionToExecute", a);
  (0,module$exports$omid$common$argsChecker.assertPositiveNumber)("timeInMillis", b);
  if (this.hasTimeoutMethods_()) {
    return module$exports$omid$common$OmidGlobalProvider.omidGlobal.setTimeout(a, b);
  }
  var c = this.remoteTimeouts_++;
  this.sendMessage_("setTimeout", a, c, b);
  return c;
};
module$exports$omid$verificationClient$VerificationClient.prototype.clearTimeout = function(a) {
  (0,module$exports$omid$common$argsChecker.assertPositiveNumber)("timeoutId", a);
  this.hasTimeoutMethods_() ? module$exports$omid$common$OmidGlobalProvider.omidGlobal.clearTimeout(a) : this.sendOneWayMessage_("clearTimeout", a);
};
module$exports$omid$verificationClient$VerificationClient.prototype.setInterval = function(a, b) {
  (0,module$exports$omid$common$argsChecker.assertFunction)("functionToExecute", a);
  (0,module$exports$omid$common$argsChecker.assertPositiveNumber)("timeInMillis", b);
  if (this.hasIntervalMethods_()) {
    return module$exports$omid$common$OmidGlobalProvider.omidGlobal.setInterval(a, b);
  }
  var c = this.remoteIntervals_++;
  this.sendMessage_("setInterval", a, c, b);
  return c;
};
module$exports$omid$verificationClient$VerificationClient.prototype.clearInterval = function(a) {
  (0,module$exports$omid$common$argsChecker.assertPositiveNumber)("intervalId", a);
  this.hasIntervalMethods_() ? module$exports$omid$common$OmidGlobalProvider.omidGlobal.clearInterval(a) : this.sendOneWayMessage_("clearInterval", a);
};
module$exports$omid$verificationClient$VerificationClient.prototype.hasTimeoutMethods_ = function() {
  return "function" === typeof module$exports$omid$common$OmidGlobalProvider.omidGlobal.setTimeout && "function" === typeof module$exports$omid$common$OmidGlobalProvider.omidGlobal.clearTimeout;
};
module$exports$omid$verificationClient$VerificationClient.prototype.hasIntervalMethods_ = function() {
  return "function" === typeof module$exports$omid$common$OmidGlobalProvider.omidGlobal.setInterval && "function" === typeof module$exports$omid$common$OmidGlobalProvider.omidGlobal.clearInterval;
};
module$exports$omid$verificationClient$VerificationClient.prototype.handleMessage_ = function(a, b) {
  b = a.method;
  var c = a.guid;
  a = a.args;
  if ("response" === b && this.callbackMap_[c]) {
    var d = (0,module$exports$omid$common$ArgsSerDe.deserializeMessageArgs)(module$contents$omid$verificationClient$VerificationClient_VERIFICATION_CLIENT_VERSION, a);
    this.callbackMap_[c].apply(this, d);
  }
  "error" === b && window.console && module$exports$omid$common$logger.error(a);
};
module$exports$omid$verificationClient$VerificationClient.prototype.sendOneWayMessage_ = function(a, b) {
  for (var c = [], d = 1; d < arguments.length; ++d) {
    c[d - 1] = arguments[d];
  }
  this.sendMessage_.apply(this, [].concat([a, null], $jscomp.arrayFromIterable(c)));
};
module$exports$omid$verificationClient$VerificationClient.prototype.sendMessage_ = function(a, b, c) {
  for (var d = [], e = 2; e < arguments.length; ++e) {
    d[e - 2] = arguments[e];
  }
  this.communication && (e = this.communication.generateGuid(), b && (this.callbackMap_[e] = b), d = new module$exports$omid$common$InternalMessage(e, "VerificationService." + a, module$contents$omid$verificationClient$VerificationClient_VERIFICATION_CLIENT_VERSION, (0,module$exports$omid$common$ArgsSerDe.serializeMessageArgs)(module$contents$omid$verificationClient$VerificationClient_VERIFICATION_CLIENT_VERSION, d)), this.communication.sendMessage(d));
};
(0,module$exports$omid$common$exporter.packageExport)("OmidVerificationClient", module$exports$omid$verificationClient$VerificationClient);
var module$contents$omid$validationVerificationScript$ValidationVerificationClient_DefaultLogServer = "http://iabtechlab.com:66/sendMessage?msg=", module$exports$omid$validationVerificationScript$ValidationVerificationClient = function(a, b) {
  var c = this;
  this.verificationClient_ = a;
  a = this.verificationClient_.isSupported();
  this.logMessage_("OmidSupported[" + a + "]", (new Date).getTime());
  a && (this.verificationClient_.registerSessionObserver(function(a) {
    return c.sessionObserverCallback_(a);
  }, b), Object.keys(module$exports$omid$common$constants.AdEventType).filter(function(a) {
    return "VIDEO" !== a;
  }).forEach(function(a) {
    c.verificationClient_.addEventListener(module$exports$omid$common$constants.AdEventType[a], function(a) {
      c.omidEventListenerCallback_(a);
    });
  }));
};
module$exports$omid$validationVerificationScript$ValidationVerificationClient.prototype.logMessage_ = function(a, b) {
  console.log("[" + (new Date(b)).toISOString() + "]", a);
};
module$exports$omid$validationVerificationScript$ValidationVerificationClient.prototype.omidEventListenerCallback_ = function(a) {
  this.logMessage_(a, a.timestamp);
};
module$exports$omid$validationVerificationScript$ValidationVerificationClient.prototype.sessionObserverCallback_ = function(a) {
  this.logMessage_(a, a.timestamp);
};
var module$exports$validationVerificationClientMain = {};
new module$exports$omid$validationVerificationScript$ValidationVerificationClient(new module$exports$omid$verificationClient$VerificationClient, "iabtechlab.com-omid");

}, typeof exports === 'undefined' ? undefined : exports));

