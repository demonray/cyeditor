
import { memoize } from 'lodash'

function canStartOn(this: any, node: any) {
  const { options, previewEles, ghostEles, handleNode } = this
  const isPreview = (el: any) => previewEles.anySame(el)
  const isGhost = (el: any) => ghostEles.anySame(el)
  const userFilter = (el: any) => el.filter(options.handleNodes).length > 0
  const isHandle = (el: any) => handleNode.same(el)
  const isTemp = (el: any) => isPreview(el) || isHandle(el) || isGhost(el)

  const { enabled, active, grabbingNode } = this

  return (
    enabled && !active && !grabbingNode &&
    (node == null || (!isTemp(node) && userFilter(node)))
  )
}

function canStartDrawModeOn(this: any, node: any) {
  return this.canStartOn(node) && this.drawMode
}

function canStartNonDrawModeOn(this: any, node: any) {
  return this.canStartOn(node) && !this.drawMode
}

function show(this: any, node: any) {
  let { options, drawMode } = this

  if (!this.canStartOn(node) || (drawMode && !options.handleInDrawMode)) { return }

  this.sourceNode = node

  this.setHandleFor(node)

  this.emit('show', this.hp(), this.sourceNode)

  return this
}

function hide(this: any) {
  this.removeHandle()

  this.emit('hide', this.hp(), this.sourceNode)

  return this
}

function start(this: any, node: any) {
  if (!this.canStartOn(node)) { return }

  this.active = true

  this.sourceNode = node
  this.sourceNode.addClass('eh-source')

  this.disableGestures()
  this.disableEdgeEvents()

  this.emit('start', this.hp(), node)
}

function update(this: any, pos: any) {
  if (!this.active) { return }

  let p = pos

  this.mx = p.x
  this.my = p.y

  this.updateEdge()
  this.throttledSnap()

  return this
}

function snap(this: any) {
  if (!this.active || !this.options.snap) { return false }

  let cy = this.cy
  let tgt = this.targetNode
  let threshold = this.options.snapThreshold
  let sqThreshold = (n: any) => { let r = getRadius(n); let t = r + threshold; return t * t }
  let mousePos = this.mp()
  let sqDist = (p1: { x: number; y: number }, p2: { x: number; y: number }) => (p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y)
  let getRadius = (n: { outerWidth: () => any; outerHeight: () => any }) => (n.outerWidth() + n.outerHeight()) / 4
  let nodeSqDist = memoize((n) => sqDist(n.position(), mousePos), (n) => n.id())
  let isWithinTheshold = (n: any) => nodeSqDist(n) <= sqThreshold(n)
  let cmpSqDist = (n1: any, n2: any) => nodeSqDist(n1) - nodeSqDist(n2)
  let allowHoverDelay = false

  let nodesByDist = cy.nodes(isWithinTheshold).sort(cmpSqDist)
  let snapped = false

  if (tgt.nonempty() && !isWithinTheshold(tgt)) {
    this.unpreview(tgt)
  }

  for (let i = 0; i < nodesByDist.length; i++) {
    let n = nodesByDist[i]

    if (n.same(tgt) || this.preview(n, allowHoverDelay)) {
      snapped = true
      break
    }
  }

  return snapped
}

function preview(this: any, target: { same: (arg0: any) => any; addClass: (arg0: string) => void }, allowHoverDelay = true) {
  let { options, sourceNode, ghostNode, ghostEles, presumptiveTargets, previewEles, active } = this
  let source = sourceNode
  let isLoop = target.same(source)
  let loopAllowed = options.loopAllowed(target)
  let isGhost = target.same(ghostNode)
  let noEdge = !options.edgeType(source, target)
  let isHandle = target.same(this.handleNode)
  let isExistingTgt = target.same(this.targetNode)

  if (!active || isHandle || isGhost || noEdge || isExistingTgt || (isLoop && !loopAllowed)) { return false }

  if (this.targetNode.nonempty()) {
    this.unpreview(this.targetNode)
  }

  clearTimeout(this.previewTimeout)

  let applyPreview = () => {
    this.targetNode = target

    presumptiveTargets.merge(target)

    target.addClass('eh-presumptive-target')
    target.addClass('eh-target')

    this.emit('hoverover', this.mp(), source, target)

    if (options.preview) {
      target.addClass('eh-preview')

      ghostEles.addClass('eh-preview-active')
      sourceNode.addClass('eh-preview-active')
      target.addClass('eh-preview-active')

      this.makePreview()

      this.emit('previewon', this.mp(), source, target, previewEles)
    }
  }

  if (allowHoverDelay && options.hoverDelay > 0) {
    this.previewTimeout = setTimeout(applyPreview, options.hoverDelay)
  } else {
    applyPreview()
  }

  return true
}

function unpreview(this: any, target: { same: (arg0: any) => any; removeClass: (arg0: string) => void }) {
  if (!this.active || target.same(this.handleNode)) { return }

  let { previewTimeout, sourceNode, previewEles, ghostEles, cy } = this
  clearTimeout(previewTimeout)
  this.previewTimeout = null

  let source = sourceNode

  target.removeClass('eh-preview eh-target eh-presumptive-target eh-preview-active')
  ghostEles.removeClass('eh-preview-active')
  sourceNode.removeClass('eh-preview-active')

  this.targetNode = cy.collection()

  this.removePreview(source, target)

  this.emit('hoverout', this.mp(), source, target)
  this.emit('previewoff', this.mp(), source, target, previewEles)

  return this
}

function stop(this: any) {
  if (!this.active) { return }

  let { sourceNode, targetNode, ghostEles, presumptiveTargets } = this

  clearTimeout(this.previewTimeout)

  sourceNode.removeClass('eh-source')
  targetNode.removeClass('eh-target eh-preview eh-hover')
  presumptiveTargets.removeClass('eh-presumptive-target')

  this.makeEdges()

  this.removeHandle()

  ghostEles.remove()

  this.clearCollections()

  this.resetGestures()
  this.enableEdgeEvents()

  this.active = false

  this.emit('stop', this.mp(), sourceNode)

  return this
}

export default {
  show,
  hide,
  start,
  update,
  preview,
  unpreview,
  stop,
  snap,
  canStartOn,
  canStartDrawModeOn,
  canStartNonDrawModeOn
}
