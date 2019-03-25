/**
 * Created by DemonRay on 2019/3/22.
 */
import dragula from 'dragula'
import utils from '../../utils'
import 'dragula/dragula.styl'
import { nodeTypes, getNodeConf }  from '../../const'

const defaults = {
    container: false,
}

class DragAddNodes {
    constructor ( cy, params = defaults ) {
        this.cy = cy
        this.options = params
        this.initShapePanel()
        this.initShapeItems()
        this.initEvents()
    }

    initShapeItems () {
        let shapes = nodeTypes.filter(item => item.type && item.src).map(item => {
            return `<img src="${item.src}" class="shape-item" data-type="${item.type}" />`
        }).join('')
        this.shapePanel.innerHTML = shapes
    }

    initEvents () {
        let leftContainers = this.shapePanel
        let rightContainers = this.cy.container()
        dragula([ leftContainers, rightContainers ], {
            copy: true,
            direction: 'horizontal',
            accepts: ( el, target )=> {
                return target === rightContainers
            }
        }).on('drop', ( el, target ) => {
            if (target === rightContainers) {
                target.removeChild(el)
                let nodeType = el.getAttribute('data-type')
                if(nodeType) {
                    let shape = getNodeConf(nodeType)
                    this.addNodeToCy(shape)
                    //this.cy.trigger('')
                }
            }
        })
    }

    addNodeToCy({type}) {
        let node = {
            group: 'nodes',
            data: { id:'jj',type , name:'', resize:true},
            //position: { x: 200, y: 200 },
        }
        this.cy.add(node)
        this.cy.trigger('dragAddNodes.add',node)
    }

    initShapePanel () {
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

// registers the extension on a cytoscape lib ref
function register ( cytoscape ) {
    if (!cytoscape) { return } // can't register if cytoscape unspecified

    cytoscape('core', 'dragAddNodes', function ( params ) {
        let cy = this
        return new DragAddNodes(cy, params)
    }) // register with cytoscape.js
}

if (typeof cytoscape !== 'undefined') { // expose to global cytoscape (i.e. window.cytoscape)
    register(cytoscape)
}

export default  register
