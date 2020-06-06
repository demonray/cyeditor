type emptyFn = (...args: any[]) => any
export interface Options {
  preview?: boolean,
  hoverDelay?: number,
  handleNodes?: string | emptyFn
  snap?: boolean,
  snapThreshold?: number,
  snapFrequency?: number,
  noEdgeEventsInDraw?: boolean
  disableBrowserGestures?: boolean,
  handlePosition?: emptyFn,
  handleInDrawMode?: boolean,
  edgeType?: emptyFn
  nodeLoopOffset?: number,
  nodeParams?: emptyFn,
  edgeParams?: emptyFn
  ghostEdgeParams?: emptyFn,
  show?: emptyFn,
  hide?: emptyFn,
  start?: emptyFn,
  complete?: emptyFn,
  stop?: emptyFn,
  cancel?: emptyFn,
  hoverover?: emptyFn,
  hoverout?: emptyFn,
  previewon?: emptyFn,
  previewoff?: emptyFn,
  drawon?: emptyFn,
  drawoff?: emptyFn,
}

export default {
  preview: true, // whether to show added edges preview before releasing selection
  hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  handleNodes: 'node', // selector/filter function for whether edges can be made from a given node
  snap: false, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
  snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
  snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
  noEdgeEventsInDraw: false, // set events:no to edges during draws, prevents mouseouts on compounds
  disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
  handlePosition(node: any) {
    return 'middle top' // sets the position of the handle in the format of "X-AXIS Y-AXIS" such as "left top", "middle top"
  },
  handleInDrawMode: false, // whether to show the handle in draw mode
  edgeType(sourceNode: any, targetNode: any) {
    // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
    // returning null/undefined means an edge can't be added between the two nodes
    return 'flat'
  },
  loopAllowed(node: any) {
    // for the specified node, return whether edges from itself to itself are allowed
    return false
  },
  nodeLoopOffset: -50, // offset for edgeType: 'node' loops
  nodeParams(sourceNode: any, targetNode: any) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for intermediary node
    return {}
  },
  edgeParams(sourceNode: any, targetNode: any, i: any) {
    // for edges between the specified source and target
    // return element object to be passed to cy.add() for edge
    // NB: i indicates edge index in case of edgeType: 'node'
    return {}
  },
  ghostEdgeParams() {
    // return element object to be passed to cy.add() for the ghost edge
    // (default classes are always added for you)
    return {}
  },
  show(sourceNode: any) {
    // fired when handle is shown
  },
  hide(sourceNode: any) {
    // fired when the handle is hidden
  },
  start(sourceNode: any) {
    // fired when edgehandles interaction starts (drag on handle)
  },
  complete(sourceNode: any, targetNode: any, addedEles: any) {
    // fired when edgehandles is done and elements are added
  },
  stop(sourceNode: any) {
    // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
  },
  cancel(sourceNode: any, cancelledTargets: any) {
    // fired when edgehandles are cancelled (incomplete gesture)
  },
  hoverover(sourceNode: any, targetNode: any) {
    // fired when a target is hovered
  },
  hoverout(sourceNode: any, targetNode: any) {
    // fired when a target isn't hovered anymore
  },
  previewon(sourceNode: any, targetNode: any, previewEles: any) {
    // fired when preview is shown
  },
  previewoff(sourceNode: any, targetNode: any, previewEles: any) {
    // fired when preview is hidden
  },
  drawon() {
    // fired when draw mode enabled
  },
  drawoff() {
    // fired when draw mode disabled
  }
}

