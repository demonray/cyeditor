/**
 * Created by DemonRay on 2019/3/20.
 */

;(function () {
    'use strict'

    var class2type = {}

    var getProto = Object.getPrototypeOf;

    var toString = class2type.toString

    var hasOwn = class2type.hasOwnProperty

    var fnToString = hasOwn.toString

    var ObjectFunctionString = fnToString.call( Object )

    var isFunction = function isFunction ( obj ) {
        // Support: Chrome <=57, Firefox <=52
        // In some browsers, typeof returns "function" for HTML <object> elements
        // (i.e., `typeof document.createElement( "object" ) === "function"`).
        // We don't want to classify *any* DOM node as a function.
        return typeof obj === 'function' && typeof obj.nodeType !== 'number'
    }

    var $ = {
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
        offset: function ( Node, offset ) {
            if (!offset) {
                offset = {}
                offset.top = 0
                offset.left = 0
            }

            if (Node == document.body || Node === null) {//当该节点为body节点时，结束递归
                return offset
            }

            offset.top += Node.offsetTop
            offset.left += Node.offsetLeft

            return $.offset(Node.offsetParent, offset)//向上累加offset里的值
        }
    }

    var defaults = {
        container: false, // can be a selector
        viewLiveFramerate: 0, // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
        dblClickDelay: 200,// milliseconds
        removeCustomContainer: true, // destroy the container specified by user on plugin destroy
        rerenderDelay: 500 // ms to throttle rerender updates to the panzoom for performance
    }

    var debounce = (function () {
        var FUNC_ERROR_TEXT = 'Expected a function'

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

    // ported lodash throttle function
    var throttle = function ( func, wait, options ) {
        var leading = true,
            trailing = true

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

    var Navigator = function ( element, options ) {
        this._init(element, options)
    }

    Navigator.prototype = {
        constructor: Navigator,
        bb: function () {
            var bb = this.cy.elements().boundingBox()

            if (bb.w === 0 || bb.h === 0) {
                return {
                    x1: 0,
                    x2: Infinity,
                    y1: 0,
                    y2: Infinity,
                    w: Infinity,
                    h: Infinity
                } // => hide interactive overlay
            }

            return bb
        },
        _addCyListener: function ( events, handler ) {
            this._cyListeners.push({
                events: events,
                handler: handler
            })

            this.cy.on(events, handler)
        },
        _removeCyListeners: function () {
            var cy = this.cy

            this._cyListeners.forEach(function ( l ) {
                cy.off(l.events, l.handler)
            })

            cy.offRender(this._onRenderHandler)
        },
        _init: function ( cy, options ) {
            this._cyListeners = []
            this.$cyElement = cy.container()
            this.options = $.extend({}, defaults, options)

            this.cy = cy

            // Cache bounding box
            this.boundingBox = this.bb()

            var eleRect = this.$cyElement.getBoundingClientRect()
            // Cache sizes
            this.width = eleRect.width
            this.height = eleRect.height

            // Init components
            this._initPanel()
            this._initThumbnail()
            this._initView()
            this._initOverlay()
        },
        destroy: function () {
            this._removeCyListeners()
            this._removeEventsHandling()

            // If container is not created by navigator and its removal is prohibited
            if (this.options.container && !this.options.removeCustomContainer) {
                var childs = this.$panel.childNodes;
                for(var i = childs .length - 1; i >= 0; i--) {
                    this.$panel.removeChild(childs[i]);
                }
            } else {
                this.$panel.parentNode.removeChild(this.$panel)
            }
        },
        _initPanel: function () {
            var options = this.options

            if (options.container) {
                if (typeof options.container === 'string') {
                    this.$panel = $.query(options.container)[ 0 ]
                } else if ($.isNode(options.container)) {
                    this.$panel = options.container
                }
                if(!this.$panel) {
                    console.error('There is no any element matching your container')
                    return
                }
            } else {
                this.$panel = document.createElement('div')
                document.body.appendChild(this.$panel)
            }

            this.$panel.classList.add('cytoscape-navigator')

            this._setupPanel()
            this._addCyListener('resize', this.resize.bind(this))
        },
        _setupPanel: function () {
            var panelRect = this.$panel.getBoundingClientRect()
            // Cache sizes
            this.panelWidth = panelRect.width
            this.panelHeight = panelRect.height
        },
        _initThumbnail: function () {
            // Create thumbnail
            this.$thumbnail = document.createElement('img')

            // Add thumbnail canvas to the DOM
            this.$panel.appendChild(this.$thumbnail)

            // Setup thumbnail
            this._setupThumbnailSizes()
            this._setupThumbnail()
        },
        _setupThumbnail: function () {
            this._updateThumbnailImage()
        },
        _setupThumbnailSizes: function () {
            // Update bounding box cache
            this.boundingBox = this.bb()

            this.thumbnailZoom = Math.min(this.panelHeight / this.boundingBox.h, this.panelWidth / this.boundingBox.w)

            // Used on thumbnail generation
            this.thumbnailPan = {
                x: (this.panelWidth - this.thumbnailZoom * (this.boundingBox.x1 + this.boundingBox.x2)) / 2,
                y: (this.panelHeight - this.thumbnailZoom * (this.boundingBox.y1 + this.boundingBox.y2)) / 2
            }
        },

        // If bounding box has changed then update sizes
        // Otherwise just update the thumbnail
        _checkThumbnailSizesAndUpdate: function () {
            // Cache previous values
            var _zoom = this.thumbnailZoom
            var _pan_x = this.thumbnailPan.x
            var _pan_y = this.thumbnailPan.y

            this._setupThumbnailSizes()

            if (_zoom != this.thumbnailZoom || _pan_x != this.thumbnailPan.x || _pan_y != this.thumbnailPan.y) {
                this._setupThumbnail()
                this._setupView()
            } else {
                this._updateThumbnailImage()
            }
        },

        _initView: function () {
            var that = this

            this.$view = document.createElement('div')
            this.$view.className = 'cytoscape-navigatorView'
            this.$panel.appendChild(this.$view)

            var viewStyle = window.getComputedStyle(this.$view)

            // Compute borders
            this.viewBorderTop = parseInt(viewStyle[ 'border-top-width' ], 10)
            this.viewBorderRight = parseInt(viewStyle[ 'border-right-width' ], 10)
            this.viewBorderBottom = parseInt(viewStyle[ 'border-bottom-width' ], 10)
            this.viewBorderLeft = parseInt(viewStyle[ 'border-left-width' ], 10)

            // Abstract borders
            this.viewBorderHorizontal = this.viewBorderLeft + this.viewBorderRight
            this.viewBorderVertical = this.viewBorderTop + this.viewBorderBottom

            this._setupView()

            // Hook graph zoom and pan
            this._addCyListener('zoom pan', this._setupView.bind(this))
        },
        _setupView: function () {
            if (this.viewLocked)
                return

            var cyZoom = this.cy.zoom()
            var cyPan = this.cy.pan()

            // Horizontal computation
            this.viewW = this.width / cyZoom * this.thumbnailZoom
            this.viewX = -cyPan.x * this.viewW / this.width + this.thumbnailPan.x - this.viewBorderLeft

            // Vertical computation
            this.viewH = this.height / cyZoom * this.thumbnailZoom
            this.viewY = -cyPan.y * this.viewH / this.height + this.thumbnailPan.y - this.viewBorderTop

            // CSS view
            this.$view.style.width = this.viewW + 'px'
            this.$view.style.height = this.viewH + 'px'
            this.$view.style.position = 'absolute'
            this.$view.style.left = this.viewX + 'px'
            this.$view.style.top = this.viewY + 'px'
        },

        /*
         * Used inner attributes
         *
         * timeout {number} used to keep stable frame rate
         * lastMoveStartTime {number}
         * inMovement {boolean}
         * hookPoint {object} {x: 0, y: 0}
         */
        _initOverlay: function () {
            // Used to capture mouse events
            this.$overlay = document.createElement('div')
            this.$overlay.className = 'cytoscape-navigatorOverlay'

            // Add overlay to the DOM
            this.$panel.appendChild(this.$overlay)

            // Init some attributes
            this.overlayHookPointX = 0
            this.overlayHookPointY = 0

            // Listen for events
            this._initEventsHandling()
        },

        /****************************
         Event handling functions
         ****************************/

        resize: function () {
            // Cache sizes
            var panelRect = this.$cyElement.getBoundingClientRect()
            this.width = panelRect.width
            this.height = panelRect.height
            this._setupPanel()
            this._checkThumbnailSizesAndUpdate()
            this._setupView()
        },
        _initEventsHandling: function () {
            var that = this
            var eventsLocal = [
                // Mouse events
                'mousedown',
                'mousewheel',
                'DOMMouseScroll', // Mozilla specific event
                // Touch events
                'touchstart'
            ]
            var eventsGlobal = [
                'mouseup',
                'mouseout',
                'mousemove',
                // Touch events
                'touchmove',
                'touchend'
            ]

            // handle events and stop their propagation
            var overlayListener = function ( env ) {
                // Touch events
                var ev = $.extend({}, env)
                if (ev.type == 'touchstart') {
                    // Will count as middle of View
                    ev.offsetX = that.viewX + that.viewW / 2
                    ev.offsetY = that.viewY + that.viewH / 2
                }

                // Normalize offset for browsers which do not provide that value
                if (ev.offsetX === undefined || ev.offsetY === undefined) {
                    var targetOffset = $.offset(ev.target)
                    ev.offsetX = ev.pageX - targetOffset.left
                    ev.offsetY = ev.pageY - targetOffset.top
                }

                if (ev.type == 'mousedown' || ev.type == 'touchstart') {
                    that._eventMoveStart(ev)
                } else if (ev.type == 'mousewheel' || ev.type == 'DOMMouseScroll') {
                    that._eventZoom(ev)
                }

                env.preventDefault();
                // Prevent default and propagation
                // Don't use peventPropagation as it breaks mouse events
                return false
            }

            // Hook global events
            var globalListener = function ( env ) {
                var ev = $.extend({}, env)
                // Do not make any computations if it is has no effect on Navigator
                if (!that.overlayInMovement) return
                // Touch events
                if (ev.type == 'touchend') {
                    // Will count as middle of View
                    ev.offsetX = that.viewX + that.viewW / 2
                    ev.offsetY = that.viewY + that.viewH / 2
                } else if (ev.type == 'touchmove') {
                    // Hack - we take in account only first touch
                    ev.pageX = ev.touches[ 0 ].pageX
                    ev.pageY = ev.touches[ 0 ].pageY
                }

                // Normalize offset for browsers which do not provide that value
                if (ev.target && (ev.offsetX === undefined || ev.offsetY === undefined)) {
                    var targetOffset = $.offset(ev.target)
                    ev.offsetX = ev.pageX - targetOffset.left
                    ev.offsetY = ev.pageY - targetOffset.top
                }

                // Translate global events into local coordinates
                if (ev.target && ev.target !== that.$overlay) {
                    var targetOffset = $.offset(ev.target)
                    var overlayOffset = $.offset(that.$overlay)

                    if (targetOffset && overlayOffset) {
                        ev.offsetX = ev.offsetX - overlayOffset.left + targetOffset.left
                        ev.offsetY = ev.offsetY - overlayOffset.top + targetOffset.top
                    } else {
                        return false
                    }
                }

                if (ev.type == 'mousemove' || ev.type == 'touchmove') {
                    that._eventMove(ev)
                } else if (ev.type == 'mouseup' || ev.type == 'touchend') {
                    that._eventMoveEnd(ev)
                }

                env.preventDefault();
                // Prevent default and propagation
                // Don't use peventPropagation as it breaks mouse events
                return false
            }

            eventsLocal.forEach(function ( item ) {
                that.$overlay.addEventListener(item, overlayListener)
            })

            eventsGlobal.forEach(function ( item ) {
                window.addEventListener(item, globalListener)
            })

            this._removeEventsHandling = function () {
                eventsGlobal.forEach(function ( item ) {
                    window.removeEventListener(item, globalListener)
                })
                eventsLocal.forEach(function ( item ) {
                    that.$overlay.addEventListener(item, overlayListener)
                })
            }
        },
        _eventMoveStart: function ( ev ) {
            var now = new Date().getTime()

            // Check if it was double click
            if (this.overlayLastMoveStartTime
                && this.overlayLastMoveStartTime + this.options.dblClickDelay > now) {
                // Reset lastMoveStartTime
                this.overlayLastMoveStartTime = 0
                // Enable View in order to move it to the center
                this.overlayInMovement = true

                // Set hook point as View center
                this.overlayHookPointX = this.viewW / 2
                this.overlayHookPointY = this.viewH / 2

                // Move View to start point
                if (this.options.viewLiveFramerate !== false) {
                    this._eventMove({
                        offsetX: this.panelWidth / 2,
                        offsetY: this.panelHeight / 2
                    })
                } else {
                    this._eventMoveEnd({
                        offsetX: this.panelWidth / 2,
                        offsetY: this.panelHeight / 2
                    })
                }

                this.cy.reset();

                // View should be inactive as we don't want to move it right after double click
                this.overlayInMovement = false
            }
            // This is a single click
            // Take care as single click happens before double click 2 times
            else {
                this.overlayLastMoveStartTime = now
                this.overlayInMovement = true
                // Lock view moving caused by cy events
                this.viewLocked = true

                // if event started in View
                if (ev.offsetX >= this.viewX && ev.offsetX <= this.viewX + this.viewW
                    && ev.offsetY >= this.viewY && ev.offsetY <= this.viewY + this.viewH
                ) {
                    this.overlayHookPointX = ev.offsetX - this.viewX
                    this.overlayHookPointY = ev.offsetY - this.viewY
                }
                // if event started in Thumbnail (outside of View)
                else {
                    // Set hook point as View center
                    this.overlayHookPointX = this.viewW / 2
                    this.overlayHookPointY = this.viewH / 2

                    // Move View to start point
                    this._eventMove(ev)
                }
            }
        },
        _eventMove: function ( ev ) {
            var that = this

            this._checkMousePosition(ev)

            // break if it is useless event
            if (!this.overlayInMovement) {
                return
            }

            // Update cache
            this.viewX = ev.offsetX - this.overlayHookPointX
            this.viewY = ev.offsetY - this.overlayHookPointY

            // Update view position
            this.$view.style.left = this.viewX + 'px'
            this.$view.style.top = this.viewY + 'px'

            // Move Cy
            if (this.options.viewLiveFramerate !== false) {
                // trigger instantly
                if (this.options.viewLiveFramerate == 0) {
                    this._moveCy()
                }
                // trigger less often than frame rate
                else if (!this.overlayTimeout) {
                    // Set a timeout for graph movement
                    this.overlayTimeout = setTimeout(function () {
                        that._moveCy()
                        that.overlayTimeout = false
                    }, 1000 / this.options.viewLiveFramerate)
                }
            }
        },
        _checkMousePosition: function ( ev ) {
            // If mouse in over View
            if (ev.offsetX > this.viewX && ev.offsetX < this.viewX + this.viewBorderHorizontal + this.viewW
                && ev.offsetY > this.viewY && ev.offsetY < this.viewY + this.viewBorderVertical + this.viewH) {
                this.$panel.classList.add('mouseover-view')
            } else {
                this.$panel.classList.remove('mouseover-view')
            }
        },
        _eventMoveEnd: function ( ev ) {
            // Unlock view changing caused by graph events
            this.viewLocked = false

            // Remove class when mouse is not over Navigator
            this.$panel.classList.remove('mouseover-view')

            if (!this.overlayInMovement) {
                return
            }

            // Trigger one last move
            this._eventMove(ev)

            // If mode is not live then move graph on drag end
            if (this.options.viewLiveFramerate === false) {
                this._moveCy()
            }

            // Stop movement permission
            this.overlayInMovement = false
        },
        _eventZoom: function ( ev ) {

            var zoomRate = Math.pow(10, ev.wheelDeltaY / 1000 || ev.wheelDelta / 1000 || ev.detail / -32)
            var mousePosition = {
                left: ev.offsetX,
                top: ev.offsetY
            }
            if (this.cy.zoomingEnabled()) {
                this._zoomCy(zoomRate, mousePosition)
            }
        },
        _updateThumbnailImage: function () {
            var that = this

            if (this._thumbnailUpdating) {
                return
            }

            this._thumbnailUpdating = true

            var render = function () {
                that._checkThumbnailSizesAndUpdate()
                that._setupView()

                var img = that.$thumbnail
                if (!img) return

                var w = that.panelWidth
                var h = that.panelHeight
                var bb = that.boundingBox
                var zoom = Math.min(w / bb.w, h / bb.h)

                var translate = {
                    x: (w - zoom * ( bb.w )) / 2,
                    y: (h - zoom * ( bb.h )) / 2
                }

                var png = that.cy.png({
                    full: true,
                    scale: zoom
                })

                if (png.indexOf('image/png') < 0) {
                    img.removeAttribute('src')
                } else {
                    img.setAttribute('src', png)
                }

                img.style.position = 'absolute'
                img.style.left = translate.x + 'px'
                img.style.top = translate.y + 'px'
            }

            this._onRenderHandler = throttle(render, that.options.rerenderDelay)

            this.cy.onRender(this._onRenderHandler)
        },

        _moveCy: function () {
            this.cy.pan({
                x: -(this.viewX + this.viewBorderLeft - this.thumbnailPan.x) * this.width / this.viewW,
                y: -(this.viewY + this.viewBorderLeft - this.thumbnailPan.y) * this.height / this.viewH
            })
        },

        _zoomCy: function ( zoomRate, zoomCenterRaw ) {
            var zoomCenter = {
                x: this.width / 2,
                y: this.height / 2
            }

            this.cy.zoom({
                level: this.cy.zoom() * zoomRate,
                renderedPosition: zoomCenter
            })
        }
    }

    // registers the extension on a cytoscape lib ref
    var register = function ( cytoscape ) {

        if (!cytoscape) { return } // can't register if cytoscape unspecified

        cytoscape('core', 'navigator', function ( options ) {

            return new Navigator(this, options)
        })

    }

    if (typeof module !== 'undefined' && module.exports) { // expose as a commonjs module
        module.exports = function ( cytoscape ) {
            register(cytoscape)
        }
    } else if (typeof define !== 'undefined' && define.amd) { // expose as an amd/requirejs module
        define('cytoscape-navigator', function () {
            return register
        })
    }

    if (typeof cytoscape !== 'undefined') {
        register(cytoscape)
    }

})()
