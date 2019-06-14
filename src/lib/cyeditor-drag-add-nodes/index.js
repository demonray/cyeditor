/**
 * Created by DemonRay on 2019/3/22.
 */
import utils from '../../utils'
import 'dragula/dragula.styl'
import { defaultNodeTypes, getNodeConf } from '../../const'

const defaults = {
  container: false,
  addWhenDrop: true
}

class DragAddNodes {
  constructor (cy, params) {
    this.cy = cy
    this._options = Object.assign({}, defaults, params)
    this._initShapePanel()
    this._initShapeItems()
    this._initEvents()
  }

  _initShapeItems () {
    let shapes = defaultNodeTypes.filter(item => item.type && item.src).map(item => {
      return `<img src="${item.src}"  class="shape-item" draggable="true" data-type="${item.type}" />`
    }).join('')
    this._shapePanel.innerHTML = shapes
  }

  _initEvents () {
    let rightContainers = this.cy.container()
    let handler = (e) => {
      e.preventDefault()
    }

    utils.query('.shape-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('shapeType', e.target.getAttribute('data-type'))
      })
    })

    rightContainers.addEventListener('drop', (e) => {
      let nodeType = e.dataTransfer.getData('shapeType')
      let pos = e.target.compareDocumentPosition(rightContainers)
      if (pos === 10) {
        let rect = { x: e.offsetX, y: e.offsetY }
        if (nodeType) {
          let shape = getNodeConf(nodeType)
          this._addNodeToCy(shape, rect)
        }
      }
    })

    rightContainers.addEventListener('dragenter', handler)
    rightContainers.addEventListener('dragover', handler)
  }

  _addNodeToCy ({ type, width, height, bg, resize, name = '', points }, rect) {
    let node = {
      group: 'nodes',
      data: { type, name, resize, bg, width, height },
      position: rect
    }
    if (points) {
      node.data.points = points
    }
    if (this._options.addWhenDrop) {
      this.cy.trigger('cyeditor.addnode', node)
    }
  }

  _initShapePanel () {
    let { _options } = this
    if (_options.container) {
      if (typeof _options.container === 'string') {
        this._shapePanel = utils.query(_options.container)[ 0 ]
      } else if (utils.isNode(_options.container)) {
        this._shapePanel = _options.container
      }
      if (!this._shapePanel) {
        console.error('There is no any element matching your container')
      }
    } else {
      this._shapePanel = document.createElement('div')
      document.body.appendChild(this._shapePanel)
    }
  }
}

export default (cytoscape) => {
  if (!cytoscape) { return }

  cytoscape('core', 'dragAddNodes', function (params) {
    return new DragAddNodes(this, params)
  })
}
