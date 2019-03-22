/**
 * Created by DemonRay on 2019/3/21.
 */
;(function () {
    'use strict'

    var class2type = {}

    var getProto = Object.getPrototypeOf

    var toString = class2type.toString

    var hasOwn = class2type.hasOwnProperty

    var fnToString = hasOwn.toString

    var ObjectFunctionString = fnToString.call(Object)

    var isFunction = function isFunction ( obj ) {
        // Support: Chrome <=57, Firefox <=52
        // In some browsers, typeof returns "function" for HTML <object> elements
        // (i.e., `typeof document.createElement( "object" ) === "function"`).
        // We don't want to classify *any* DOM node as a function.
        return typeof obj === 'function' && typeof obj.nodeType !== 'number'
    }

    var $ = {
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
        offset: function ( Node, offset ) {
            if (!offset) {
                offset = {}
                offset.top = 0
                offset.left = 0
            }

            if (Node == document.body || Node === null || Node === undefined) {//当该节点为body节点时，结束递归
                return offset
            }

            offset.top += Node.offsetTop
            offset.left += Node.offsetLeft

            return $.offset(Node.offsetParent, offset)//向上累加offset里的值
        }
    }
    // registers the extension on a cytoscape lib ref
    var register = function ( cytoscape ) {

        if (!cytoscape) { return } // can't register if cytoscape unspecified

        cytoscape('core', 'snapToGrid', function ( params ) {
            var cy = this
            var fn = params
            var container = cy.container()
            var defaultParams = {
                stackOrder: -1,
                gridSpacing: 40,
                strokeStyle: '#CCCCCC',
                lineWidth: 1.0,
                lineDash: [ 5, 8 ],
                zoomDash: true,
                panGrid: true,
                snapToGrid: true,
                drawGrid: true
            }
            var dataCache = {}

            var functions = {
                //Enables snap-to-grid:
                snapOn: function () {
                    this.trigger('snaptogrid.snapon')
                },

                //Disables snap-to-grid:
                snapOff: function () {
                    this.trigger('snaptogrid.snapoff')
                },

                //Enables the grid drawing:
                gridOn: function () {
                    this.trigger('snaptogrid.gridon')
                },

                //Disables the grid drawing:
                gridOff: function () {
                    this.trigger('snaptogrid.gridoff')
                },

                //Redraws the grid:
                refresh: function () {
                    this.trigger('snaptogrid.refresh')
                },

                //Gets or sets an option:
                option: function ( name, value ) {
                    var data = dataCache.snapToGrid

                    if (data == null) {
                        return
                    }

                    var options = data.options

                    if (value === undefined) {
                        if (typeof name == typeof {}) {
                            var newOpts = name
                            options = $.extend(true, {}, defaultParams, newOpts)
                            data.options = options
                        } else {
                            return options[ name ]
                        }
                    } else {
                        options[ name ] = value
                    }

                    dataCache.snapToGrid = data

                    this.trigger('snaptogrid.refresh')

                    return this
                },

                //Initialization function:
                init: function () {
                    var $canvas = document.createElement('canvas')
                    var ctx

                    var opts = $.extend(true, {}, defaultParams, params)
                    dataCache.snapToGrid = opts

                    var optionsCache
                    var options = function () {
                        return optionsCache || ( optionsCache = dataCache.snapToGrid )
                    }

                    var resizeCanvas = function () {
                        var rect = container.getBoundingClientRect()
                        $canvas.height = rect.height
                        $canvas.width = rect.width
                        $canvas.style.position = 'absolute'
                        $canvas.style.top = 0
                        $canvas.style.left = 0
                        $canvas.style.zIndex = options().stackOrder


                        setTimeout(function () {
                            var canvasBb = $.offset($canvas)
                            var containerBb = $.offset(container)
                            $canvas.style.top = -( canvasBb.top - containerBb.top )
                            $canvas.style.left = -( canvasBb.left - containerBb.left )
                            drawGrid()
                        }, 0)
                    }

                    var drawGrid = function () {
                        clearDrawing()

                        if (!options().drawGrid) {
                            return
                        }

                        var zoom = cy.zoom()
                        var rect = container.getBoundingClientRect()
                        var canvasWidth = rect.width
                        var canvasHeight = rect.height
                        var increment = options().gridSpacing * zoom
                        var pan = cy.pan()
                        var initialValueX = pan.x % increment
                        var initialValueY = pan.y % increment

                        ctx.strokeStyle = options().strokeStyle
                        ctx.lineWidth = options().lineWidth

                        if (options().zoomDash) {
                            var zoomedDash = options().lineDash.slice()

                            for (var i = 0; i < zoomedDash.length; i++) {
                                zoomedDash[ i ] = options().lineDash[ i ] * zoom
                            }
                            ctx.setLineDash(zoomedDash)
                        } else {
                            ctx.setLineDash(options().lineDash)
                        }

                        if (options().panGrid) {
                            ctx.lineDashOffset = -pan.y
                        } else {
                            ctx.lineDashOffset = 0
                        }

                        for (var i = initialValueX; i < canvasWidth; i += increment) {
                            ctx.beginPath()
                            ctx.moveTo(i, 0)
                            ctx.lineTo(i, canvasHeight)
                            ctx.stroke()
                        }

                        if (options().panGrid) {
                            ctx.lineDashOffset = -pan.x
                        } else {
                            ctx.lineDashOffset = 0
                        }

                        for (var i = initialValueY; i < canvasHeight; i += increment) {
                            ctx.beginPath()
                            ctx.moveTo(0, i)
                            ctx.lineTo(canvasWidth, i)
                            ctx.stroke()
                        }
                    }

                    var clearDrawing = function () {
                        var rect = container.getBoundingClientRect()
                        var width = rect.width
                        var height = rect.height

                        ctx.clearRect(0, 0, width, height)
                    }

                    var snapNode = function ( node ) {
                        var pos = node.position()

                        var cellX = Math.floor(pos.x / options().gridSpacing)
                        var cellY = Math.floor(pos.y / options().gridSpacing)

                        node.position({
                            x: (cellX + 0.5) * options().gridSpacing,
                            y: (cellY + 0.5) * options().gridSpacing
                        })
                    }

                    var snapAll = function () {
                        cy.nodes().each(function ( node ) {
                            snapNode(node)
                        })
                    }

                    var nodeFreed = function ( ev ) {
                        if (options().snapToGrid) {
                            snapNode(ev.target)
                        }
                    }

                    var nodeAdded = function ( ev ) {
                        if (options().snapToGrid) {
                            snapNode(ev.target)
                        }
                    }

                    var snapOn = function () {
                        options().snapToGrid = true
                        snapAll()
                    }

                    var snapOff = function () {
                        options().snapToGrid = false
                    }

                    var gridOn = function () {
                        options().drawGrid = true
                        drawGrid()
                    }

                    var gridOff = function () {
                        options().drawGrid = false
                        drawGrid()
                    }

                    this.append($canvas)
                    window.addEventListener('resize', resizeCanvas)
                    // this.on('snaptogrid.snapon', snapOn)
                    // this.on('snaptogrid.snapoff', snapOff)
                    // this.on('snaptogrid.gridon', gridOn)
                    // this.on('snaptogrid.gridoff', gridOff)
                    // this.on('snaptogrid.refresh', resizeCanvas)
                    ctx = $canvas.getContext('2d')

                    cy.ready(function () {
                        resizeCanvas()

                        if (options().snapToGrid) {
                            snapAll()
                        }

                        cy.on('zoom', drawGrid)
                        cy.on('pan', drawGrid)
                        cy.on('free', nodeFreed)
                        cy.on('add', nodeAdded)
                    })
                }
            }

            if (functions[ fn ]) {
                return functions[ fn ].apply(container, Array.prototype.slice.call(arguments, 1))
            } else if (typeof fn == 'object' || !fn) {
                return functions.init.apply(container, arguments)
            } else {
                console.error('No such function `' + fn + '` for snapToGrid')
            }

            return this // chainability
        })

    }

    if (typeof module !== 'undefined' && module.exports) { // expose as a commonjs module
        module.exports = register
    }

    if (typeof define !== 'undefined' && define.amd) { // expose as an amd/requirejs module
        define('cytoscape-snap-to-grid', function () {
            return register
        })
    }

    if (typeof cytoscape !== 'undefined') { // expose to global cytoscape (i.e. window.cytoscape)
        register(cytoscape)
    }

})()
