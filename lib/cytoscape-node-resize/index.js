/**
 * Created by DemonRay on 2019/3/22.
 */
;(function ( cytoscape) {
    'use strict'

    var arr = []

    var slice = arr.slice

    var class2type = {}

    var getProto = Object.getPrototypeOf;

    var toString = class2type.toString

    var hasOwn = class2type.hasOwnProperty

    var fnToString = hasOwn.toString

    var ObjectFunctionString = fnToString.call( Object )

    var isFunction = function isFunction ( obj ) {
        return typeof obj === 'function' && typeof obj.nodeType !== 'number'
    }

    var $ = {
        query: document.querySelectorAll.bind(document),
        guid: 1,
        proxy: function ( fn, context ) {
            var tmp, args, proxy

            if (typeof context === 'string') {
                tmp = fn[ context ]
                context = fn
                fn = tmp
            }

            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if (!isFunction(fn)) {
                return undefined
            }

            // Simulated bind
            args = slice.call(arguments, 2)
            proxy = function () {
                return fn.apply(context || this, args.concat(slice.call(arguments)))
            }

            // Set the guid of unique handler to the same of original handler, so it can be removed
            proxy.guid = fn.guid = fn.guid || $.guid++

            return proxy
        },
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
        once(dom, type, callback) {
            var handle = function() {
                callback()
                dom.removeEventListener(type, handle)
            }
            dom.addEventListener(type, handle)
        }
    }

    var debounce = (function () {

        var FUNC_ERROR_TEXT = 'Expected a function'

        /* Native method references for those with the same name as other `lodash` methods. */
        var nativeMax = Math.max,
            nativeNow = Date.now

        var now = nativeNow || function () {
                return new Date().getTime()
            }

        function debounce ( func, wait, options ) {
            var args,
                maxTimeoutId,
                result,
                stamp,
                thisArg,
                timeoutId,
                trailingCall,
                lastCalled = 0,
                maxWait = false,
                trailing = true

            if (typeof func != 'function') {
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

            function complete ( isCalled, id ) {
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
                    var remaining = maxWait - (stamp - lastCalled),
                        isCalled = remaining <= 0 || remaining > maxWait

                    if (isCalled) {
                        if (maxTimeoutId) {
                            maxTimeoutId = clearTimeout(maxTimeoutId)
                        }
                        lastCalled = stamp
                        result = func.apply(thisArg, args)
                    }
                    else if (!maxTimeoutId) {
                        maxTimeoutId = setTimeout(maxDelayed, remaining)
                    }
                }
                if (isCalled && timeoutId) {
                    timeoutId = clearTimeout(timeoutId)
                }
                else if (!timeoutId && wait !== maxWait) {
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

        function isObject ( value ) {
            // Avoid a V8 JIT bug in Chrome 19-20.
            // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
            var type = typeof value
            return !!value && (type == 'object' || type == 'function')
        }

        return debounce

    })()

    // registers the extension on a cytoscape lib ref
    var register = function ( cytoscape) {
        if (!cytoscape) {return}

        var defaults = {
            handleColor: '#000000', // the colour of the handle and the line drawn from it
            hoverDelay: 150, // time spend over a target node before it is considered a target selection
            enabled: true, // whether to start the plugin in the enabled state
            minNodeWidth: 30,
            minNodeHeight: 30,
            triangleSize: 10,
            lines: 3,
            padding: 5,

            start: function ( sourceNode ) {
                // fired when noderesize interaction starts (drag on handle)
            },
            complete: function ( sourceNode, targetNodes, addedEntities ) {
                // fired when noderesize is done and entities are added
            },
            stop: function ( sourceNode ) {
                // fired when noderesize interaction is stopped (either complete with added edges or incomplete)
            }
        }

        /**
         * Checks if the point p is inside the triangle p0,p1,p2
         * using barycentric coordinates
         */
        function ptInTriangle ( p, p0, p1, p2 ) {
            var A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y)
            var sign = A < 0 ? -1 : 1
            var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign
            var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign

            return s > 0 && t > 0 && (s + t) < 2 * A * sign
        }

        var optCache = {}

        function cytoscapeNodeResize ( params ) {
            var fn = params
            var cy = this
            var container = cy.container()
            var optCache = {}

            var functions = {
                destroy: function () {
                    var data = optCache.cynoderesize

                    if (!data) {
                        return
                    }

                    data.unbind()
                    optCache.cynoderesize = {}

                    return container
                },

                option: function ( name, value ) {
                    var data = optCache.cynoderesize

                    if (!data) {
                        return
                    }

                    var options = data.options

                    if (value === undefined) {
                        if (typeof name == typeof {}) {
                            var newOpts = name
                            options = $.extend(true, {}, defaults, newOpts)
                            data.options = options
                        } else {
                            return options[ name ]
                        }
                    } else {
                        options[ name ] = value
                    }

                    optCache.cynoderesize =  data

                    return container
                },

                disable: function () {
                    return functions.option.apply(this, [ 'enabled', false ])
                },

                enable: function () {
                    return functions.option.apply(this, [ 'enabled', true ])
                },

                resize: function () {
                    this.trigger('cynoderesize.resize')
                },

                drawon: function () {
                    this.trigger('cynoderesize.drawon')
                },

                drawoff: function () {
                    this.trigger('cynoderesize.drawoff')
                },

                init: function () {
                    var opts = $.extend(true, {}, defaults, params)
                    var $canvas = document.createElement('canvas')
                    var mdownOnHandle = false
                    var grabbingNode = false
                    var inForceStart = false
                    var hoverTimeout
                    var drawsClear = true
                    var sourceNode
                    var drawMode = false

                    container.append($canvas)

                    var rect = container.getBoundingClientRect()

                    var _sizeCanvas = debounce(function () {
                        $canvas.width = rect.width
                        $canvas.height = rect.height

                        $.css($canvas, {
                            'position': 'absolute',
                            'top': 0,
                            'left': 0,
                            'zIndex': '999'
                        })

                        setTimeout(function () {
                            var canvasBb = $.offset($canvas)
                            var containerBb = $.offset(container)
                            $.css($canvas, {
                                'top': -( canvasBb.top - containerBb.top ) + 'px',
                                'left': -( canvasBb.left - containerBb.left ) + 'px'
                            })
                        }, 0)

                    }, 250)

                    _sizeCanvas()

                    window.addEventListener('resize',_sizeCanvas)

                    this.on('cynoderesize.resize', _sizeCanvas)

                    var prevUngrabifyState
                    this.on('cynoderesize.drawon', function () {
                        drawMode = true

                        prevUngrabifyState = cy.autoungrabify()

                        cy.autoungrabify(true)
                    })

                    this.on('cynoderesize.drawoff', function () {
                        console.log('off',cy,this)
                        drawMode = false

                        cy.autoungrabify(prevUngrabifyState)
                    })

                    var ctx = $canvas.getContext('2d')

                    // write options to data
                    var data = optCache && optCache.cynoderesize;
                    if (!data) {
                        data = {}
                    }
                    data.options = opts

                    function options () {
                        return optCache.cynoderesize ? optCache.cynoderesize.options : {}
                    }

                    function enabled () {
                        return options().enabled
                    }

                    function disabled () {
                        return !enabled()
                    }

                    function clearDraws () {

                        if (drawsClear) {
                            return
                        } // break early to be efficient

                        var containerRect = container.getBoundingClientRect()

                        var w = containerRect.width
                        var h = containerRect.height

                        ctx.clearRect(0, 0, w, h)
                        drawsClear = true
                    }

                    var lastPanningEnabled, lastZoomingEnabled, lastBoxSelectionEnabled

                    function disableGestures () {
                        lastPanningEnabled = cy.panningEnabled()
                        lastZoomingEnabled = cy.zoomingEnabled()
                        lastBoxSelectionEnabled = cy.boxSelectionEnabled()

                        cy
                            .zoomingEnabled(false)
                            .panningEnabled(false)
                            .boxSelectionEnabled(false)
                    }

                    function resetGestures () {
                        cy
                            .zoomingEnabled(lastZoomingEnabled)
                            .panningEnabled(lastPanningEnabled)
                            .boxSelectionEnabled(lastBoxSelectionEnabled)
                    }

                    function resetToDefaultState () {

                        clearDraws()

                        sourceNode = null

                        resetGestures()
                    }

                    function drawHandle ( node ) {
                        var cy = node.cy()
                        ctx.fillStyle = options().handleColor
                        ctx.strokeStyle = options().handleColor
                        var padding = options().padding * cy.zoom()
                        var p = node.renderedPosition()
                        var w = node.renderedOuterWidth() + padding * 2
                        var h = node.renderedOuterHeight() + padding * 2
                        var ts = options().triangleSize * cy.zoom()

                        var x1 = p.x + w / 2 - ts
                        var y1 = p.y + h / 2
                        var x2 = p.x + w / 2
                        var y2 = p.y + h / 2 - ts

                        var lines = options().lines
                        var wStep = ts / lines
                        var hStep = ts / lines
                        var lw = 1.5 * cy.zoom()
                        for (var i = 0; i < lines - 1; i++) {
                            ctx.beginPath()
                            ctx.moveTo(x1, y1)
                            ctx.lineTo(x2, y2)
                            ctx.lineTo(x2, y2 + lw)
                            ctx.lineTo(x1 + lw, y1)
                            ctx.lineTo(x1, y1)
                            ctx.closePath()
                            ctx.fill()
                            x1 += wStep
                            y2 += hStep
                        }
                        ctx.beginPath()
                        ctx.moveTo(x2, y1)
                        ctx.lineTo(x2, y2)
                        ctx.lineTo(x1, y1)
                        ctx.closePath()
                        ctx.fill()

                        drawsClear = false
                    }


                    function bindEvents () {
                        lastPanningEnabled = cy.panningEnabled()
                        lastZoomingEnabled = cy.zoomingEnabled()
                        lastBoxSelectionEnabled = cy.boxSelectionEnabled()

                        cy.style().selector('.noderesize-resized').css({
                            'width': 'data(width)',
                            'height': 'data(height)',
                        })

                        var lastActiveId

                        var transformHandler
                        cy.bind('zoom pan', transformHandler = function () {
                            clearDraws()
                        })

                        var lastMdownHandler

                        var startHandler, hoverHandler, leaveHandler, grabNodeHandler, freeNodeHandler, dragNodeHandler,
                            forceStartHandler, removeHandler, tapToStartHandler, dragHandler, grabHandler
                        cy.on('mouseover tap', 'node', startHandler = function ( e ) {

                            var node = this


                            if (disabled() || drawMode || mdownOnHandle || grabbingNode || inForceStart || node.isParent()) {
                                return // don't override existing handle that's being dragged
                                // also don't trigger when grabbing a node etc
                            }

                            if (lastMdownHandler) {
                                container.removeEventListener('mousedown', lastMdownHandler, true)
                                container.removeEventListener('touchstart', lastMdownHandler, true)
                            }

                            lastActiveId = node.id()

                            // remove old handle
                            clearDraws()

                            // add new handle
                            drawHandle(node)

                            node.trigger('cynoderesize.showhandle')
                            var lastPosition = {}

                            function mdownHandler ( e ) {

                                container.removeEventListener('mousedown', mdownHandler, true)
                                container.removeEventListener('touchstart', mdownHandler, true)

                                var pageX = !e.touches ? e.pageX : e.touches[ 0 ].pageX
                                var pageY = !e.touches ? e.pageY : e.touches[ 0 ].pageY
                                var x = pageX - $.offset(container).left
                                var y = pageY - $.offset(container).top
                                lastPosition.x = x
                                lastPosition.y = y

                                if (e.button !== 0 && !e.touches) {
                                    return // sorry, no right clicks allowed
                                }

                                var padding = options().padding
                                var rp = node.renderedPosition()
                                var w = node.renderedOuterWidth() + padding * 2
                                var h = node.renderedOuterHeight() + padding * 2
                                var ts = options().triangleSize * cy.zoom()

                                var x1 = rp.x + w / 2 - ts
                                var y1 = rp.y + h / 2
                                var x2 = rp.x + w / 2
                                var y2 = rp.y + h / 2 - ts

                                var p = {x: x, y: y}
                                var p0 = {x: x1, y: y1}
                                var p1 = {x: x2, y: y2}
                                var p2 = {x: rp.x + w / 2, y: rp.y + h / 2}

                                if (!ptInTriangle(p, p0, p1, p2)) {
                                    return // only consider this a proper mousedown if on the handle
                                }

                                if (inForceStart) {
                                    return // we don't want this going off if we have the forced start to consider
                                }

                                // console.log('mdownHandler %s %o', node.id(), node);
                                node.addClass('noderesize-resized')

                                mdownOnHandle = true

                                e.preventDefault()
                                e.stopPropagation()

                                sourceNode = node

                                node.trigger('cynoderesize.start')
                                var originalSize = {
                                    width: node.width(),
                                    height: node.height()
                                }

                                function doneMoving ( dmEvent ) {
                                    // console.log('doneMoving %s %o', node.id(), node);

                                    if (!mdownOnHandle || inForceStart) {
                                        return
                                    }

                                    mdownOnHandle = false
                                    window.removeEventListener('mousemove',moveHandler)
                                    window.removeEventListener('touchmove',moveHandler)
                                    resetToDefaultState()

                                    options().stop(node)
                                    node.trigger('cynoderesize.stop')
                                    cy.trigger('cynoderesize.noderesized',
                                        [
                                            node,
                                            originalSize,
                                            {
                                                width: node.width(),
                                                height: node.height()
                                            }
                                        ]
                                    )
                                }

                                ['mouseup','touchend','touchcancel','blur'].forEach(function ( e ) {
                                    $.once(window,e,doneMoving)
                                })
                                window.addEventListener('mousemove',moveHandler)
                                window.addEventListener('touchmove',moveHandler)
                                disableGestures()
                                options().start(node)

                                return false
                            }

                            function moveHandler ( e ) {
                                // console.log('mousemove moveHandler %s %o', node.id(), node);

                                var pageX = !e.touches ? e.pageX : e.touches[ 0 ].pageX
                                var pageY = !e.touches ? e.pageY : e.touches[ 0 ].pageY
                                var x = pageX - $.offset(container).left
                                var y = pageY - $.offset(container).top


                                var dx = x - lastPosition.x
                                var dy = y - lastPosition.y

                                lastPosition.x = x
                                lastPosition.y = y
                                // console.log(dx + " " + dy);
                                var keepAspectRatio = e.ctrlKey
                                var w = node.data('width') || node.width();
                                var h = node.data('height') || node.height();


                                if (keepAspectRatio) {
                                    var aspectRatio = w / h
                                    if (dy == 0) {
                                        dy = dx = dx * aspectRatio
                                    } else {
                                        dx = dy = (dy < 0 ? Math.min(dx, dy) : Math.max(dx, dy)) * aspectRatio
                                    }
                                }
                                dx /= cy.zoom()
                                dy /= cy.zoom()

                                node.data('width', Math.max(w + dx, options().minNodeWidth));
                                node.data('height', Math.max(h + dy, options().minNodeHeight));

                                clearDraws()
                                drawHandle(node)

                                return false
                            }

                            container.addEventListener('mousedown', mdownHandler, true)
                            container.addEventListener('touchstart', mdownHandler, true)
                            lastMdownHandler = mdownHandler

                        }).on('mouseover tapdragover', 'node', hoverHandler = function () {

                            if (disabled() || drawMode) {
                                return // ignore preview nodes
                            }

                            if (mdownOnHandle) { // only handle mdown case

                                return false
                            }

                        }).on('mouseout tapdragout', 'node', leaveHandler = function () {
                            if (drawMode) {
                                return
                            }

                            if (mdownOnHandle) {
                                clearTimeout(hoverTimeout)
                            }

                        }).on('drag position', 'node', dragNodeHandler = function () {
                            if (drawMode) {
                                return
                            }
                            setTimeout(clearDraws, 50)

                        }).on('grab', 'node', grabHandler = function () {

                            clearDraws()

                        }).on('drag', 'node', dragHandler = function () {
                            grabbingNode = true

                        }).on('free', 'node', freeNodeHandler = function () {
                            grabbingNode = false

                        }).on('cynoderesize.forcestart', 'node', forceStartHandler = function () {
                            var node = this

                            inForceStart = true
                            clearDraws() // clear just in case

                            sourceNode = node

                            lastActiveId = node.id()

                            node.trigger('cynoderesize.start')

                            drawHandle(node)

                            node.trigger('cynoderesize.showhandle')

                            function reset () {
                                container.removeEventListener('mousemove', moveHandler, true)
                                container.removeEventListener('touchmove', moveHandler, true)

                                inForceStart = false // now we're done so reset the flag
                                mdownOnHandle = false // we're also no longer down on the node

                                options().stop(node)
                                node.trigger('cynoderesize.stop')

                                cy.off('tap', 'node', tapHandler)
                                node.off('remove', removeBeforeHandler)

                                resetToDefaultState()
                            }

                            // case: down and drag as normal
                            var downHandler = function ( e ) {

                                container.removeEventListener('mousedown', downHandler, true)
                                container.removeEventListener('touchstart', downHandler, true)

                                var x = (e.pageX !== undefined ? e.pageX : e.touches[ 0 ].pageX) - container.offset().left
                                var y = (e.pageY !== undefined ? e.pageY : e.touches[ 0 ].pageY) - container.offset().top
                                var d = hr / 2
                                var onNode = p.x - w / 2 - d <= x && x <= p.x + w / 2 + d && p.y - h / 2 - d <= y && y <= p.y + h / 2 + d

                                if (onNode) {
                                    disableGestures()
                                    mdownOnHandle = true // enable the regular logic for handling going over target nodes

                                    var moveHandler = function ( ) {

                                        clearDraws()
                                        drawHandle(node)
                                    }

                                    container.addEventListener('mousemove', moveHandler, true)
                                    container.addEventListener('touchmove', moveHandler, true)

                                    ['mouseup','touchend','blur'].forEach(function ( e ) {
                                        $.once(window,e,reset)
                                    })

                                    e.stopPropagation()
                                    e.preventDefault()
                                    return false
                                }
                            }

                            container.addEventListener('mousedown', downHandler, true)
                            container.addEventListener('touchstart', downHandler, true)

                            var removeBeforeHandler
                            node.one('remove', function () {
                                container.removeEventListener('mousedown', downHandler, true)
                                container.removeEventListener('touchstart', downHandler, true)
                                cy.off('tap', 'node', tapHandler)
                            })

                            // case: tap a target node
                            var tapHandler
                            cy.one('tap', 'node', tapHandler = function () {
                                var target = this

                                inForceStart = false // now we're done so reset the flag

                                options().stop(node)
                                node.trigger('cynoderesize.stop')

                                container.removeEventListener('mousedown', downHandler, true)
                                container.removeEventListener('touchstart', downHandler, true)
                                node.off('remove', removeBeforeHandler)
                                resetToDefaultState()
                            })

                        }).on('remove', 'node', removeHandler = function () {
                            var id = this.id()

                            if (id === lastActiveId) {
                                setTimeout(function () {
                                    resetToDefaultState()
                                }, 5)
                            }

                        }).on('tap', 'node', tapToStartHandler = function () {
                            return
                            var node = this

                            if (!sourceNode) { // must not be active
                                setTimeout(function () {
                                    clearDraws() // clear just in case

                                    drawHandle(node)

                                    node.trigger('cynoderesize.showhandle')
                                }, 16)
                            }

                        })

                        data.unbind = function () {
                            cy
                                .off('mouseover', 'node', startHandler)
                                .off('mouseover', 'node', hoverHandler)
                                .off('mouseout', 'node', leaveHandler)
                                .off('drag position', 'node', dragNodeHandler)
                                .off('grab', 'node', grabNodeHandler)
                                .off('free', 'node', freeNodeHandler)
                                .off('cynoderesize.forcestart', 'node', forceStartHandler)
                                .off('remove', 'node', removeHandler)
                                .off('tap', 'node', tapToStartHandler)

                            cy.unbind('zoom pan', transformHandler)
                        }

                    }

                    bindEvents.call(this)

                    optCache.cynoderesize = data;

                    return this;

                },

                start: function ( id ) {
                    cy.$('#' + id).trigger('cynoderesize.forcestart')
                }
            }

            if (functions[ fn ]) {
                return functions[ fn ].apply(this, Array.prototype.slice.call(arguments, 1))
            } else if (typeof fn == 'object' || !fn) {
                return functions.init.apply(this, arguments)
            } else {
                console.error('No such function')
            }

            return this
        }

        cytoscape('core', 'noderesize', function ( options ) {
            return cytoscapeNodeResize.call(this, options)
        })

    }

    if (typeof module !== 'undefined' && module.exports) { // expose as a commonjs module
        module.exports = register
    }

    if (typeof define !== 'undefined' && define.amd) { // expose as an amd/requirejs module
        define('cytoscape-noderesize', function () {
            return register
        })
    }

    if (cytoscape) { // expose to global cytoscape (i.e. window.cytoscape)
        register(cytoscape)
    }

})()
