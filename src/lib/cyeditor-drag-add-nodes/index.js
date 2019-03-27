/**
 * Created by DemonRay on 2019/3/22.
 */
import utils from '../../utils'
import 'dragula/dragula.styl'
import { defaultNodeTypes, getNodeConf }  from '../../const'

const defaults = {
    container: false,
    addWhenDrop: true,
}

class DragAddNodes {
    constructor ( cy, params = defaults ) {
        this.cy = cy
        this.options = Object.assign(defaults, params)
        this._initShapePanel()
        this._initShapeItems()
        this._initEvents()
    }

    _initShapeItems () { // todo NodeTypes should use editor config,if defaults has been covered
        let shapes = defaultNodeTypes.filter(item => item.type && item.src).map(item => {
            return `<img src="${item.src}"  class="shape-item" draggable="true" data-type="${item.type}" />`
        }).join('')
        this.shapePanel.innerHTML = shapes
    }

    _initEvents () {

        let rightContainers = this.cy.container()
        let handler = ( e ) => {
            e.preventDefault()
        }

        utils.query('.shape-item').forEach(item => {
            item.addEventListener('dragstart', ( e ) => {
                e.dataTransfer.setData('shapeType', e.target.getAttribute('data-type'))
            })
        })

        rightContainers.addEventListener('drop', ( e ) => {
            let nodeType = e.dataTransfer.getData('shapeType')
            let pos = e.target.compareDocumentPosition(rightContainers)
            if (pos === 10) {
                let rect = {x: e.offsetX, y: e.offsetY}
                if (nodeType) {
                    let shape = getNodeConf(nodeType)
                    this._addNodeToCy(shape, rect)
                }
            }
        })

        rightContainers.addEventListener('dragenter', handler)
        rightContainers.addEventListener('dragover', handler)

    }

    _addNodeToCy ( {type, width, height, bg, resize, name = ''}, rect ) {
        let node = {
            group: 'nodes',
            data: {type, name, resize, bg, width, height},
            position: rect
        }
        if (this.options.addWhenDrop) {
            this.cy.add(node)
        }
        this.cy.trigger('cyeditor.addnode', node)
    }

    _initShapePanel () {
        let {options} = this
        if (options.container) {
            if (typeof options.container === 'string') {
                this.shapePanel = utils.query(options.container)[ 0 ]
            } else if (utils.isNode(options.container)) {
                this.shapePanel = options.container
            }
            if (!this.shapePanel) {
                console.error('There is no any element matching your container')
                return
            }
        } else {
            this.shapePanel = document.createElement('div')
            document.body.appendChild(this.shapePanel)
        }
    }
}

export default  ( cytoscape ) => {
    if (!cytoscape) { return }

    cytoscape('core', 'dragAddNodes', function ( params ) {
        return new DragAddNodes(this, params)
    })
}
