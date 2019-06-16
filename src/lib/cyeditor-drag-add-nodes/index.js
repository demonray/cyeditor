/**
 * Created by DemonRay on 2019/3/22.
 */
import utils from '../../utils'

const defaults = {
  container: false,
  addWhenDrop: true,
  nodeTypes: []
}

class DragAddNodes {
  constructor (cy, params) {
    this.cy = cy
    this._options = Object.assign({}, defaults, params)
    this._options.nodeTypes.forEach(item => {
      item.width = item.width || 76
      item.height = item.height || 76
      item.category = item.category || 'other'
    })

    if (this._options.nodeTypes.length < 1) return
    this._initShapePanel()
    this._initShapeItems()
    this._initEvents()
  }

  _initShapeItems () {
    let shapes = this._options.nodeTypes.filter(item => item.type && item.src)
    shapes.forEach(item => {
      item._id = utils.guid()
    })
    let categorys = {}
    let other = []
    shapes.forEach(item => {
      if (item.category) {
        if (categorys[item.category]) {
          categorys[item.category].push(item)
        } else {
          categorys[item.category] = [item]
        }
      } else {
        other.push(item)
      }
    })
    if (other.length) {
      categorys.other = other
    }
    let categoryDom = Object.keys(categorys).map(item => {
      let shapeItems = categorys[item].map(data => {
        return `<img src="${data.src}"  class="shape-item" draggable="true" data-id="${data._id}" />`
      }).join('')
      return `<div class="category">
                  <div class="title">${item}</div>
                  <div class="shapes">${shapeItems}</div>
                </div>`
    }).join('')
    this._shapePanel.innerHTML = categoryDom
  }

  _initEvents () {
    let rightContainers = this.cy.container()
    let handler = (e) => {
      e.preventDefault()
    }

    utils.query('.shape-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('id', e.target.getAttribute('data-id'))
      })
    })

    rightContainers.addEventListener('drop', (e) => {
      let shapeId = e.dataTransfer.getData('id')
      let pos = e.target.compareDocumentPosition(rightContainers)
      if (pos === 10) {
        let rect = { x: e.offsetX, y: e.offsetY }
        if (shapeId) {
          const shape = this._options.nodeTypes.find(item => item._id === shapeId)
          this._addNodeToCy(shape, rect)
        }
      }
    })

    rightContainers.addEventListener('dragenter', handler)
    rightContainers.addEventListener('dragover', handler)
  }

  _addNodeToCy ({ type, width, height, bg, resize, name = '', points, buildIn = false, src }, rect) {
    let data = { type, name, resize, bg, width, height }
    if (!buildIn) {
      data.image = src
    }
    let node = {
      group: 'nodes',
      data,
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
