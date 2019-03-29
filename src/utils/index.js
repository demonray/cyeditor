/**
 * Created by DemonRay on 2019/3/24.
 */

const class2type = {}

const getProto = Object.getPrototypeOf

const toString = class2type.toString

const hasOwn = class2type.hasOwnProperty

const fnToString = hasOwn.toString

const ObjectFunctionString = fnToString.call(Object)

const isFunction = function isFunction (obj) {
  return typeof obj === 'function' && typeof obj.nodeType !== 'number'
}

const RGBToHex = (r, g, b) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')

const debounce = (function () {
  var FUNC_ERROR_TEXT = 'Expected a function'

  var nativeMax = Math.max
  var nativeNow = Date.now

  var now = nativeNow || function () {
    return new Date().getTime()
  }

  function debounce (func, wait, options) {
    var args
    var maxTimeoutId
    var result
    var stamp
    var thisArg
    var timeoutId
    var trailingCall
    var lastCalled = 0
    var maxWait = false
    var trailing = true

    if (typeof func !== 'function') {
      throw new TypeError(FUNC_ERROR_TEXT)
    }
    wait = wait < 0 ? 0 : (+wait || 0)
    if (options === true) {
      var leading = true
      trailing = false
    } else if (isObject(options)) {
      leading = !!options.leading
      maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait)
      trailing = 'trailing' in options ? !!options.trailing : trailing
    }

    function cancel () {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (maxTimeoutId) {
        clearTimeout(maxTimeoutId)
      }
      lastCalled = 0
      maxTimeoutId = timeoutId = trailingCall = undefined
    }

    function complete (isCalled, id) {
      if (id) {
        clearTimeout(id)
      }
      maxTimeoutId = timeoutId = trailingCall = undefined
      if (isCalled) {
        lastCalled = now()
        result = func.apply(thisArg, args)
        if (!timeoutId && !maxTimeoutId) {
          args = thisArg = undefined
        }
      }
    }

    function delayed () {
      var remaining = wait - (now() - stamp)
      if (remaining <= 0 || remaining > wait) {
        complete(trailingCall, maxTimeoutId)
      } else {
        timeoutId = setTimeout(delayed, remaining)
      }
    }

    function maxDelayed () {
      complete(trailing, timeoutId)
    }

    function debounced () {
      args = arguments
      stamp = now()
      thisArg = this
      trailingCall = trailing && (timeoutId || !leading)

      if (maxWait === false) {
        var leadingCall = leading && !timeoutId
      } else {
        if (!maxTimeoutId && !leading) {
          lastCalled = stamp
        }
        var remaining = maxWait - (stamp - lastCalled)
        var isCalled = remaining <= 0 || remaining > maxWait

        if (isCalled) {
          if (maxTimeoutId) {
            maxTimeoutId = clearTimeout(maxTimeoutId)
          }
          lastCalled = stamp
          result = func.apply(thisArg, args)
        } else if (!maxTimeoutId) {
          maxTimeoutId = setTimeout(maxDelayed, remaining)
        }
      }
      if (isCalled && timeoutId) {
        timeoutId = clearTimeout(timeoutId)
      } else if (!timeoutId && wait !== maxWait) {
        timeoutId = setTimeout(delayed, wait)
      }
      if (leadingCall) {
        isCalled = true
        result = func.apply(thisArg, args)
      }
      if (isCalled && !timeoutId && !maxTimeoutId) {
        args = thisArg = undefined
      }
      return result
    }

    debounced.cancel = cancel
    return debounced
  }

  function isObject (value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof value
    return !!value && (type === 'object' || type === 'function')
  }

  return debounce
})()

// ported lodash throttle function
const throttle = function (func, wait, options) {
  var leading = true
  var trailing = true

  if (options === false) {
    leading = false
  } else if (typeof options === typeof {}) {
    leading = 'leading' in options ? options.leading : leading
    trailing = 'trailing' in options ? options.trailing : trailing
  }
  options = options || {}
  options.leading = leading
  options.maxWait = wait
  options.trailing = trailing

  return debounce(func, wait, options)
}

function isPlainObject (obj) {
  let proto, Ctor

  // Detect obvious negatives
  // Use toString instead of jQuery.type to catch host objects
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false
  }

  proto = getProto(obj)

  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if (!proto) {
    return true
  }

  // Objects with prototype are plain iff they were constructed by a global Object function
  Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
  return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString
}

function extend () {
  let options; let name; let src; let copy; let copyIsArray; let clone
  let target = arguments[ 0 ] || {}
  let i = 1
  let length = arguments.length
  let deep = false

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target

    // Skip the boolean and the target
    target = arguments[ i ] || {}
    i++
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {}
  }

  // Extend jQuery itself if only one argument is passed
  if (i === length) {
    target = this
    i--
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[ i ]) != null) {
      // Extend the base object
      for (name in options) {
        src = target[ name ]
        copy = options[ name ]

        // Prevent never-ending loop
        if (target === copy) {
          continue
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (isPlainObject(copy) ||
                    (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && Array.isArray(src) ? src : []
          } else {
            clone = src && isPlainObject(src) ? src : {}
          }

          // Never move original objects, clone them
          target[ name ] = extend(deep, clone, copy)

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[ name ] = copy
        }
      }
    }
  }

  // Return the modified object
  return target
}

export default {
  getProto,
  hasOwn,
  isFunction,
  query: document.querySelectorAll.bind(document),
  isPlainObject,
  extend,
  isNode: function (obj) {
    if (obj && obj.nodeType === 1) {
      if (window.Node && (obj instanceof Node)) {
        return true
      }
    }
  },
  css: function (el, attr) {
    if (typeof attr === 'string') { // get
      var win = el.ownerDocument.defaultView
      return win.getComputedStyle(el, null)[ attr ]
    } else if (typeof attr === 'object') { // set
      for (var k in attr) {
        el.style[ k ] = attr[ k ]
      }
    }
  },
  addClass: function (el, className) {
    el.classList.add(className)
  },
  removeClass: function (el, className) {
    el.classList.remove(className)
  },
  hasClass: function (el, className) {
    return el.classList.contains(className)
  },
  offset: function (el) {
    const box = el.getBoundingClientRect()

    return {
      top: box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft
    }
  },
  once (dom, type, callback) {
    var handle = function () {
      callback()
      dom.removeEventListener(type, handle)
    }
    dom.addEventListener(type, handle)
  },
  $ (id) { return document.getElementById(id) },
  debounce,
  throttle,
  RGBToHex
}
