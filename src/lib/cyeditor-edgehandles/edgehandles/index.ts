import { throttle } from 'lodash'
import cyGesturesToggle from './cy-gestures-toggle'
import cyListeners from './cy-listeners'
import drawing from './drawing'
import gestureLifecycle from './gesture-lifecycle'
import listeners from './listeners'
import defaults, { Options } from './defaults'

class Edgehandles {
  [x: string]: any
  constructor (cy: cytoscape.Core, options: Options) {
    this.cy = cy
    this.listeners = []
    // edgehandles gesture state
    this.enabled = true
    this.drawMode = false
    this.active = false
    this.grabbingNode = false
    // edgehandles elements
    this.handleNode = cy.collection()
    this.clearCollections()
    // handle
    this.hx = 0
    this.hy = 0
    this.hr = 0
    // mouse position
    this.mx = 0
    this.my = 0
    this.options = Object.assign({}, defaults, options)
    this.saveGestureState()
    this.addListeners()
    let snapFrequency = options.snapFrequency || defaults.snapFrequency
    this.throttledSnap = throttle(this.snap.bind(this), 1000 / snapFrequency)
    this.preventDefault = (e:any) => e.preventDefault()
    let supportsPassive = false
    try {
      let opts = Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassive = true
        }
      })
      // @ts-ignore
      window.addEventListener('test', null, opts)
    } catch (err) {}
    if (supportsPassive) {
      this.windowListenerOptions = {
        capture: true,
        passive: false
      }
    } else {
      this.windowListenerOptions = true
    }
  }
  destroy () {
    this.removeListeners()
  }
  setOptions (options: Options) {
    Object.assign(this.options, options)
  }
  mp () {
    return {
      x: this.mx,
      y: this.my
    }
  }
  hp () {
    return {
      x: this.hx,
      y: this.hy
    }
  }
  clearCollections () {
    this.previewEles = this.cy.collection()
    this.ghostEles = this.cy.collection()
    this.ghostNode = this.cy.collection()
    this.sourceNode = this.cy.collection()
    this.targetNode = this.cy.collection()
    this.presumptiveTargets = this.cy.collection()
  }
  enable () {
    this.enabled = true
    this.emit('enable')
    return this
  }

  disable () {
    this.enabled = false
    this.emit('disable')
    return this
  }
  toggleDrawMode (bool:any) {
    let {
      cy,
      options
    } = this

    this.drawMode = bool != null ? bool : !this.drawMode

    if (this.drawMode) {
      this.prevUngrabifyState = cy.autoungrabify()
      cy.autoungrabify(true)
      if (!options.handleInDrawMode && this.handleShown()) {
        this.hide()
      }
      this.emit('drawon')
    } else {
      cy.autoungrabify(this.prevUngrabifyState)
      this.emit('drawoff')
    }
    return this
  }

  enableDrawMode () {
    return this.toggleDrawMode(true)
  }

  disableDrawMode () {
    return this.toggleDrawMode(false)
  }

  disableEdgeEvents () {
    if (this.options.noEdgeEventsInDraw) {
      this.cy.edges().style('events', 'no')
    }

    return this
  }

  enableEdgeEvents () {
    if (this.options.noEdgeEventsInDraw) {
      this.cy.edges().style('events', '')
    }

    return this
  }
}

let proto = Edgehandles.prototype
let extend = (obj: any) => Object.assign(proto, obj)
const fns = [cyGesturesToggle, cyListeners, drawing, gestureLifecycle, listeners]
fns.forEach(extend)

export default Edgehandles
