/**
 * Created by DemonRay on 2019/3/24.
 */

const class2type = {}

const getProto = Object.getPrototypeOf

const toString = class2type.toString

const hasOwn = class2type.hasOwnProperty

const fnToString = hasOwn.toString

const ObjectFunctionString = fnToString.call(Object)

const isFunction = function isFunction ( obj ) {
    return typeof obj === 'function' && typeof obj.nodeType !== 'number'
}

const RGBToHex = (r, g, b) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

export default {
    getProto,
    hasOwn,
    isFunction,
    query: document.querySelectorAll.bind(document),
    isPlainObject: function ( obj ) {
        var proto, Ctor

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
    },
    extend: function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[ 0 ] || {},
            i = 1,
            length = arguments.length,
            deep = false

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
            if (( options = arguments[ i ] ) != null) {

                // Extend the base object
                for (name in options) {
                    src = target[ name ]
                    copy = options[ name ]

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && ( $.isPlainObject(copy) ||
                        ( copyIsArray = Array.isArray(copy) ) )) {

                        if (copyIsArray) {
                            copyIsArray = false
                            clone = src && Array.isArray(src) ? src : []

                        } else {
                            clone = src && $.isPlainObject(src) ? src : {}
                        }

                        // Never move original objects, clone them
                        target[ name ] = $.extend(deep, clone, copy)

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[ name ] = copy
                    }
                }
            }
        }

        // Return the modified object
        return target
    },
    isNode: function ( obj ) {
        if (obj && obj.nodeType === 1) {
            if (window.Node && (obj instanceof Node)) {
                return true
            }
        }
    },
    css: function ( el, attr ) {
        if (typeof attr === 'string') { // get
            var win = el.ownerDocument.defaultView
            return win.getComputedStyle(el, null)[ attr ]
        } else if (typeof attr === 'object') { // set
            for (var k in attr) {
                el.style[ k ] = attr[ k ]
            }
        }
    },
    addClass: function ( el, className ) {
        el.classList.add(className)
    },
    removeClass: function ( el, className ) {
        el.classList.remove(className)
    },
    hasClass: function ( el, className ) {
        return el.classList.contains(className)
    },
    offset: function ( el ) {
        const box = el.getBoundingClientRect()

        return {
            top: box.top + window.pageYOffset - document.documentElement.clientTop,
            left: box.left + window.pageXOffset - document.documentElement.clientLeft
        }
    },
    once( dom, type, callback ) {
        var handle = function () {
            callback()
            dom.removeEventListener(type, handle)
        }
        dom.addEventListener(type, handle)
    },
    $(id){return document.getElementById(id)},
    RGBToHex
}
