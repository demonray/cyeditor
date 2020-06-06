/**
 * Created by DemonRay on 2019/4/1.
 */
import utils from '../../utils'

type emptyFn = (...args: any[]) => any
interface Options {
  beforeCopy?: emptyFn,
  afterCopy?: emptyFn,
  beforePaste?: emptyFn,
  afterPaste?: emptyFn
}

class Clipboard {
  [x: string]: any
  constructor(cy: cytoscape.Core, params: any) {
    this.cy = cy
    this._options = Object.assign({}, params)
    this._counter = 0
    this._listeners = {}
    return this._init()
  }
  _init() {
    // get the scratchpad reserved for this extension on cy
    let scratchPad = this._getScratch()

    this._oldIdToNewId = {}

    if (!scratchPad.isInitialized) {
      scratchPad.isInitialized = true
      let clipboard = {}

      scratchPad.instance = {
        copy: (eles: any, cid: any) => {
          let id = cid || this._getItemId(false)
          eles.unselect()
          let descs = eles.nodes().descendants()
          let nodes = eles.nodes().union(descs).filter(':visible')
          let edges = nodes.edgesWith(nodes).filter(':visible')

          if (this._options.beforeCopy) {
            this._options.beforeCopy(nodes.union(edges))
          }
          clipboard[id] = { nodes: nodes.jsons(), edges: edges.jsons() }
          if (this._options.afterCopy) {
            this._options.afterCopy(clipboard[id])
          }
          this._targetPos = nodes[0] ? nodes[0].position() : { x: 0, y: 0 }
          return id
        },
        paste: (cid: any) => {
          let id = cid || this._getItemId(true)
          let res = this.cy.collection()
          if (this._options.beforePaste) {
            this._options.beforePaste(clipboard[id])
          }
          if (clipboard[id]) {
            let nodes = this.changeIds(clipboard[id].nodes)
            let edges = this.changeIds(clipboard[id].edges)
            this._oldIdToNewId = {}
            this.cy.batch(() => {
              res = this.cy.add(nodes).union(this.cy.add(edges))
              res.select()
            })
          }
          if (this._options.afterPaste) {
            this._options.afterPaste(res)
          }
          this.cy.trigger('cyeditor.paste')
          return res
        }
      }
    }

    return scratchPad.instance // return the extension instance
  }
  _getItemId(last: boolean) {
    return last ? 'item_' + this._counter : 'item_' + (++this._counter)
  }
  changeIds(jsons: any) {
    jsons = utils.extend(true, [], jsons)
    for (let i = 0; i < jsons.length; i++) {
      let jsonFirst = jsons[i]
      let id = utils.guid()
      this._oldIdToNewId[jsonFirst.data.id] = id
      jsonFirst.data.id = id
    }

    for (let j = 0; j < jsons.length; j++) {
      let json = jsons[j]
      let fields = ['source', 'target', 'parent']
      for (let k = 0; k < fields.length; k++) {
        let field = fields[k]
        if (json.data[field] && this._oldIdToNewId[json.data[field]]) { json.data[field] = this._oldIdToNewId[json.data[field]] }
      }
      if (json.position.x) {
        json.position.x += 50
        json.position.y += 50
      }
    }

    return jsons
  }
  _getScratch() {
    if (!this.cy.scratch('_clipboard')) {
      this.cy.scratch('_clipboard', {})
    }
    return this.cy.scratch('_clipboard')
  }

  destroy() {
    this.cy.off('mousemove', this._listeners.onmousemove)
  }
}

export default (cy?: any): void => {
  if (!cy) { return }

  cy('core', 'clipboard', function (this: cytoscape.Core, options: Options = {}) {
    return new Clipboard(this, options)
  })
}
