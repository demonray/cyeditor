/**
 * Created by DemonRay on 2019/3/22.
 */

import utils from '../../utils'

let defaults = {
  handleColor: '#000000', // the colour of the handle and the line drawn from it
  enabled: true, // whether to start the plugin in the enabled state
  minNodeWidth: 30,
  minNodeHeight: 30,
  triangleSize: 10,
  selector: 'node',
  lines: 3,
  padding: 5,

  start: function (sourceNode) {
    // fired when noderesize interaction starts (drag on handle)
  },
  complete: function (sourceNode, targetNodes, addedEntities) {
    // fired when noderesize is done and entities are added
  },
  stop: function (sourceNode) {
    // fired when noderesize interaction is stopped (either complete with added edges or incomplete)
  }
}

/**
 * Checks if the point p is inside the triangle p0,p1,p2
 * using barycentric coordinates
 */
function ptInTriangle (p, p0, p1, p2) {
  let A = 1 / 2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y)
  let sign = A < 0 ? -1 : 1
  let s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign
  let t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign

  return s > 0 && t > 0 && (s + t) < 2 * A * sign
}

class NodeResize {
  constructor (cy, params) {
    this.cy = cy
    this._container = this.cy.container()
    this._listeners = {}
    this._drawMode = false
    this._drawsClear = true
    this._options = {}
    this._init(params)
  }

  destroy () {
    let data = this._options

    if (!data) {
      return
    }
    data.unbind()
    this._options = {}
  }

  disable () {
    this._options.enabled = false
    this._options.disabled = true
  }

  enable () {
    this._options.enabled = true
    this._options.disabled = false
  }

  resize () {
    this.cy.trigger('cyeditor.noderesize-resize')
  }

  drawon () {
    this._drawMode = true
    this._prevUngrabifyState = this.cy.autoungrabify()
    this.cy.autoungrabify(true)
    this.cy.trigger('cyeditor.noderesize-drawon')
  }

  drawoff () {
    this._drawMode = false
    this.cy.autoungrabify(this._prevUngrabifyState)
    this.cy.trigger('cyeditor.noderesize-drawoff')
  }

  _init (params) {
    this._options = utils.extend(true, {}, defaults, params)
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this._container.append(this.canvas)
    this._listeners._sizeCanvas = utils.debounce(this._sizeCanvas, 250).bind(this)
    this._listeners._sizeCanvas()

    this._initEvents()
  }

  _sizeCanvas () {
    let rect = this._container.getBoundingClientRect()
    this.canvas.width = rect.width
    this.canvas.height = rect.height
    utils.css(this.canvas, {
      'position': 'absolute',
      'top': 0,
      'left': 0,
      'zIndex': '999'
    })

    setTimeout(() => {
      let canvasBb = utils.offset(this.canvas)
      let containerBb = utils.offset(this._container)
      utils.css(this.canvas, {
        'top': -(canvasBb.top - containerBb.top) + 'px',
        'left': -(canvasBb.left - containerBb.left) + 'px'
      })
    }, 0)
  }

  clearDraws () {
    if (this._drawsClear) {
      return
    }

    let containerRect = this._container.getBoundingClientRect()

    let w = containerRect.width
    let h = containerRect.height

    this.canvas.getContext('2d').clearRect(0, 0, w, h)
    this._drawsClear = true
  }

  _disableGestures () {
    this._lastPanningEnabled = this.cy.panningEnabled()
    this._lastZoomingEnabled = this.cy.zoomingEnabled()
    this._lastBoxSelectionEnabled = this.cy.boxSelectionEnabled()

    this.cy
      .zoomingEnabled(false)
      .panningEnabled(false)
      .boxSelectionEnabled(false)
  }

  _resetGestures () {
    this.cy
      .zoomingEnabled(this._lastZoomingEnabled)
      .panningEnabled(this._lastPanningEnabled)
      .boxSelectionEnabled(this._lastBoxSelectionEnabled)
  }

  _resetToDefaultState () {
    this.clearDraws()
    this.sourceNode = null
    this._resetGestures()
  }

  _drawHandle (node) {
    this.ctx.fillStyle = this._options.handleColor
    this.ctx.strokeStyle = this._options.handleColor
    let padding = this._options.padding * this.cy.zoom()
    let p = node.renderedPosition()
    let w = node.renderedOuterWidth() + padding * 2
    let h = node.renderedOuterHeight() + padding * 2
    let ts = this._options.triangleSize * this.cy.zoom()

    let x1 = p.x + w / 2 - ts
    let y1 = p.y + h / 2
    let x2 = p.x + w / 2
    let y2 = p.y + h / 2 - ts

    let lines = this._options.lines
    let wStep = ts / lines
    let hStep = ts / lines
    let lw = 1.5 * this.cy.zoom()
    for (let i = 0; i < lines - 1; i++) {
      this.ctx.beginPath()
      this.ctx.moveTo(x1, y1)
      this.ctx.lineTo(x2, y2)
      this.ctx.lineTo(x2, y2 + lw)
      this.ctx.lineTo(x1 + lw, y1)
      this.ctx.lineTo(x1, y1)
      this.ctx.closePath()
      this.ctx.fill()
      x1 += wStep
      y2 += hStep
    }
    this.ctx.beginPath()
    this.ctx.moveTo(x2, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.lineTo(x1, y1)
    this.ctx.closePath()
    this.ctx.fill()

    this._drawsClear = false
  }

  _initEvents () {
    window.addEventListener('resize', this._listeners._sizeCanvas)
    this.cy.on('cyeditor.noderesize-resize', this._listeners._sizeCanvas)
    this._grabbingNode = false

    let hoverTimeout
    this._lastPanningEnabled = this.cy.panningEnabled()
    this._lastZoomingEnabled = this.cy.zoomingEnabled()
    this._lastBoxSelectionEnabled = this.cy.boxSelectionEnabled()

    this.cy.style().selector('.noderesize-resized').css({
      'width': 'data(width)',
      'height': 'data(height)'
    })

    this._listeners.transformHandler = () => {
      this.clearDraws()
    }
    this._listeners._startHandler = this._startHandler.bind(this)

    this.cy.bind('zoom pan', this._listeners.transformHandler)

    let hoverHandler = () => {
      if (this._options.disabledd || this._drawMode) {
        return // ignore preview nodes
      }

      if (this._mdownOnHandle) { // only handle mdown case
        return false
      }
    }
    let leaveHandler = () => {
      if (this._drawMode) {
        return
      }

      if (this._mdownOnHandle) {
        clearTimeout(hoverTimeout)
      }
    }
    let freeNodeHandler = () => {
      this._grabbingNode = false
    }
    let dragNodeHandler = () => {
      if (this._drawMode) {
        return
      }
      setTimeout(() => this.clearDraws(), 50)
    }
    let removeHandler = (e) => {
      let id = e.target.id()

      if (id === this._lastActiveId) {
        setTimeout(() => {
          this._resetToDefaultState()
        }, 16)
      }
    }
    let tapToStartHandler = (e) => {
      let node = e.target

      if (!this.sourceNode) { // must not be active
        setTimeout(() => {
          this.clearDraws() // clear just in case

          this._drawHandle(node)

          node.trigger('cyeditor.noderesize-showhandle')
        }, 16)
      }
    }
    let dragHandler = () => {
      this._grabbingNode = true
    }
    let grabHandler = () => {
      this.clearDraws()
    }
    let selector = this._options.selector
    this.cy.on('mouseover tap', selector, this._listeners._startHandler)
      .on('mouseover tapdragover', selector, hoverHandler)
      .on('mouseout tapdragout', selector, leaveHandler)
      .on('drag position', selector, dragNodeHandler)
      .on('grab', selector, grabHandler)
      .on('drag', selector, dragHandler)
      .on('free', selector, freeNodeHandler)
      .on('remove', selector, removeHandler)
      .on('tap', selector, tapToStartHandler)

    this._options.unbind = () => {
      window.removeEventListener('resize', this._listeners._sizeCanvas)
      this.cy.off('mouseover', selector, this._listeners._startHandler)
        .off('mouseover', selector, hoverHandler)
        .off('mouseout', selector, leaveHandler)
        .off('drag position', selector, dragNodeHandler)
        .off('grab', selector, grabHandler)
        .off('free', selector, freeNodeHandler)
        .off('remove', selector, removeHandler)
        .off('tap', selector, tapToStartHandler)

      this.cy.unbind('zoom pan', this._listeners.transformHandler)
    }
  }

  _startHandler (e) {
    let node = e.target

    if (this._options.disabledd || this._drawMode || this._mdownOnHandle || this._grabbingNode || node.isParent()) {
      return // don't override existing handle that's being dragged also don't trigger when grabbing a node etc
    }

    if (this._listeners.lastMdownHandler) {
      this._container.removeEventListener('mousedown', this._listeners.lastMdownHandler, true)
      this._container.removeEventListener('touchstart', this._listeners.lastMdownHandler, true)
    }

    this._lastActiveId = node.id()

    // remove old handle
    this.clearDraws()

    // add new handle
    this._drawHandle(node)

    node.trigger('cyeditor.noderesize-showhandle')
    let lastPosition = {}

    let mdownHandler = (e) => {
      this._container.removeEventListener('mousedown', mdownHandler, true)
      this._container.removeEventListener('touchstart', mdownHandler, true)

      let pageX = !e.touches ? e.pageX : e.touches[ 0 ].pageX
      let pageY = !e.touches ? e.pageY : e.touches[ 0 ].pageY
      let x = pageX - utils.offset(this._container).left
      let y = pageY - utils.offset(this._container).top
      lastPosition.x = x
      lastPosition.y = y

      if (e.button !== 0 && !e.touches) {
        return // sorry, no right clicks allowed
      }

      let padding = this._options.padding
      let rp = node.renderedPosition()
      let w = node.renderedOuterWidth() + padding * 2
      let h = node.renderedOuterHeight() + padding * 2
      let ts = this._options.triangleSize * this.cy.zoom()

      let x1 = rp.x + w / 2 - ts
      let y1 = rp.y + h / 2
      let x2 = rp.x + w / 2
      let y2 = rp.y + h / 2 - ts

      let p = { x: x, y: y }
      let p0 = { x: x1, y: y1 }
      let p1 = { x: x2, y: y2 }
      let p2 = { x: rp.x + w / 2, y: rp.y + h / 2 }

      if (!ptInTriangle(p, p0, p1, p2)) {
        return // only consider this a proper mousedown if on the handle
      }

      node.addClass('noderesize-resized')

      this._mdownOnHandle = true

      e.preventDefault()
      e.stopPropagation()

      this.sourceNode = node

      node.trigger('cyeditor.noderesize-start')
      let originalSize = {
        width: node.width(),
        height: node.height()
      }

      let doneMoving = (dmEvent) => {
        if (!this._mdownOnHandle) {
          return
        }

        this._mdownOnHandle = false
        window.removeEventListener('mousemove', moveHandler)
        window.removeEventListener('touchmove', moveHandler)
        this._resetToDefaultState()

        this._options.stop(node)
        node.trigger('cyeditor.noderesize-stop')
        this.cy.trigger('cyeditor.noderesize-resized',
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

      [ 'mouseup', 'touchend', 'touchcancel', 'blur' ].forEach(function (e) {
        utils.once(window, e, doneMoving)
      })
      window.addEventListener('mousemove', moveHandler)
      window.addEventListener('touchmove', moveHandler)
      this._disableGestures()
      this._options.start(node)

      return false
    }

    let moveHandler = (e) => {
      let pageX = !e.touches ? e.pageX : e.touches[ 0 ].pageX
      let pageY = !e.touches ? e.pageY : e.touches[ 0 ].pageY
      let x = pageX - utils.offset(this._container).left
      let y = pageY - utils.offset(this._container).top

      let dx = x - lastPosition.x
      let dy = y - lastPosition.y

      lastPosition.x = x
      lastPosition.y = y
      let keepAspectRatio = e.ctrlKey
      let w = node.data('width') || node.width()
      let h = node.data('height') || node.height()

      if (keepAspectRatio) {
        let aspectRatio = w / h
        if (dy === 0) {
          dy = dx = dx * aspectRatio
        } else {
          dx = dy = (dy < 0 ? Math.min(dx, dy) : Math.max(dx, dy)) * aspectRatio
        }
      }
      dx /= this.cy.zoom()
      dy /= this.cy.zoom()

      node.data('width', Math.max(w + dx * 2, this._options.minNodeWidth))
      node.data('height', Math.max(h + dy * 2, this._options.minNodeHeight))

      this.cy.trigger('cyeditor.noderesize-resizing', [ node, {
        width: node.width(),
        height: node.height()
      } ])

      this.clearDraws()
      this._drawHandle(node)

      return false
    }

    this._container.addEventListener('mousedown', mdownHandler, true)
    this._container.addEventListener('touchstart', mdownHandler, true)
    this._listeners.lastMdownHandler = mdownHandler
  }
}

export default (cytoscape) => {
  if (!cytoscape) { return }

  cytoscape('core', 'noderesize', function (options) {
    return new NodeResize(this, options)
  })
}
