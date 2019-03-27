/**
 * Created by DemonRay on 2019/3/25.
 */

import cytoscape from 'cytoscape'
import edgehandles from 'cytoscape-edgehandles'
import dragAddNodes from './cytoscape-drag-add-nodes/index'
import editElements from './cyeditor-edit-elements'
import utils from '../utils'
import './cytoscape-navigator/style.css'
import './index.css'

cytoscape.use(edgehandles)
cytoscape.use(require('./cytoscape-navigator/index'))
cytoscape.use(require('./cytoscape-snap-grid/index'))
cytoscape.use(require('./cytoscape-node-resize/index'))
cytoscape.use(dragAddNodes)
cytoscape.use(editElements)

const config = {
    node: {
        type: 'rectangle',
        bg: '#999',
        resize: true,
        name: '',
        width: 80,
        height: 80,
    },
    edge: {
        lineColor: '#999'
    }
}

let defaults = {
    cy: {
        container: '#cy',
        layout: {
            name: 'concentric',
            fit: false,
            concentric: function ( n ) { return n.id() === 'j' ? 200 : 0 },
            levelWidth: function ( nodes ) { return 100 },
            minNodeSpacing: 100
        },
        style: [
            {
                'selector': 'node[type]',
                'style': {
                    'shape': 'data(type)',
                    'label': 'data(type)',
                    'height': 'data(height)',
                    'width': 'data(width)',
                    'text-valign': 'center',
                    'text-halign': 'center'
                }
            }, {
                'selector': 'node[points]',
                'style': {
                    'shape-polygon-points': 'data(points)',
                    'label': 'polygon\n(custom points)',
                    'text-wrap': 'wrap'
                }
            },
            {
                selector: 'node[name]',
                style: {
                    'content': 'data(name)'
                }
            },
            {
                selector: 'node[bg]',
                style: {
                    'background-opacity': 0.56,
                    'background-color': 'data(bg)',
                    'border-width': 2,
                    'border-opacity': 0.8,
                    'border-color': 'data(bg)'
                }
            },
            {
                selector: 'edge[lineColor]',
                style: {
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    'width': 2,
                    'line-color': 'data(lineColor)',
                    'source-arrow-color': 'data(lineColor)',
                    'target-arrow-color': 'data(lineColor)',
                    'mid-source-arrow-color': 'data(lineColor)',
                    'mid-target-arrow-color': 'data(lineColor)',
                }
            },
            {
                selector: 'node:active',
                style: {
                    'overlay-color': '#0169D9',
                    'overlay-padding': 12,
                    'overlay-opacity': 0.25
                }
            },
            {
                selector: 'node:selected',
                style: {
                    'overlay-color': '#0169D9',
                    'overlay-padding': 12,
                    'overlay-opacity': 0.25
                }
            },
            {
                selector: 'edge:active',
                style: {
                    'overlay-color': '#0169D9',
                    'overlay-padding': 3,
                    'overlay-opacity': 0.25,
                    'line-color': 'data(lineColor)',
                    'source-arrow-color': 'data(lineColor)',
                    'target-arrow-color': 'data(lineColor)',
                    'mid-source-arrow-color': 'data(lineColor)',
                    'mid-target-arrow-color': 'data(lineColor)',
                }
            },
            {
                selector: 'edge:selected',
                style: {
                    'overlay-color': '#0169D9',
                    'overlay-padding': 3,
                    'overlay-opacity': 0.25,
                    'line-color': 'data(lineColor)',
                    'source-arrow-color': 'data(lineColor)',
                    'target-arrow-color': 'data(lineColor)',
                    'mid-source-arrow-color': 'data(lineColor)',
                    'mid-target-arrow-color': 'data(lineColor)',
                }
            },
            // some style for the extension
            {
                selector: '.eh-handle',
                style: {
                    'background-color': 'red',
                    'width': 12,
                    'height': 12,
                    'shape': 'ellipse',
                    'overlay-opacity': 0,
                    'border-width': 12, // makes the handle easier to hit
                    'border-opacity': 0
                }
            },
            {
                selector: '.eh-hover',
                style: {
                    'background-color': 'red'
                }
            },
            {
                selector: '.eh-hover',
                style: {
                    'background-color': 'red'
                }
            },
            {
                selector: '.eh-source',
                style: {
                    'border-width': 2,
                    'border-color': 'red'
                }
            },
            {
                selector: '.eh-target',
                style: {
                    'border-width': 2,
                    'border-color': 'red'
                }
            },
            {
                selector: '.eh-preview, .eh-ghost-edge',
                style: {
                    'background-color': 'red',
                    'line-color': 'red',
                    'target-arrow-color': 'red',
                    'source-arrow-color': 'red'
                }
            },
            {
                selector: '.eh-ghost-edge.eh-preview-active',
                style: {
                    'opacity': 0
                }
            }
        ],
        elements: {
            nodes: [
                {data: {id: 'j', name: 'Jerry', resize: true, bg: '#90235d'}},
                {data: {id: 'e', name: 'Elaine', resize: true, bg: '#f0545d'}},
                {data: {id: 'k', name: 'Kramer', resize: true, bg: '#9954fd'}},
                {data: {id: 'g', name: 'George', type: 'vee', bg: '#00888d'}}
            ],
            edges: [
                {data: {source: 'j', target: 'e', lineColor: '#999'}},
                {data: {source: 'j', target: 'k'}},
                {data: {source: 'j', target: 'g'}},
                {data: {source: 'e', target: 'j'}},
                {data: {source: 'e', target: 'k'}},
                {data: {source: 'k', target: 'j'}},
                {data: {source: 'k', target: 'e'}},
                {data: {source: 'k', target: 'g'}},
                {data: {source: 'g', target: 'j'}}
            ]
        }
    },
    editor: {
        snapGrid: true
    }
}

export default class CyEditor {
    constructor ( params = defaults ) {
        this.plugins = {}
        this.initOptions(params)
        this.init()
    }

    init () {
        this.initEditor()
        this.initConf()
        this.initCy()
        this.initPlugin()
        this.initEvents()
    }

    initOptions ( params ) {
        this.editorOptions = Object.assign(defaults.editor, params.editor)
        this.cyOptions = Object.assign(defaults.cy, params.cy)
        if (this.cyOptions.elements) {
            if (Array.isArray(this.cyOptions.elements.nodes)) {
                this.cyOptions.elements.nodes.forEach(node => {
                    node.data = Object.assign({}, config.node, node.data)
                })
            }
            if (Array.isArray(this.cyOptions.elements.edges)) {
                this.cyOptions.elements.edges.forEach(edge => {
                    edge.data = Object.assign({}, config.edge, edge.data)
                })
            }
        }
    }

    initCy () {
        if (typeof this.cyOptions.container === 'string') {
            this.cyOptions.container = utils.query(this.cyOptions.container)[ 0 ]
        }
        if (!this.cyOptions.container) {
            console.error('There is no any element matching your container')
            return
        }
        this.cy = cytoscape(this.cyOptions)
        this.cy.on('click', function ( e ) {
            console.log(e.target.style())
        })
    }

    initEditor () {
        let domHtml = `<div id="toolbar">
                        </div>
                        <div id="editor">
                            <div class="left">
                                <div class="shapes"></div>
                            </div>
                        <div id="cy"></div>
                        <div class="right">
                            <div class="pannel-title">导航器</div>
                            <div id="thumb"></div>
                            <div class="pannel-title">画布</div>
                            <div class="pannel-body">
                                <div class="p">网格对齐：
                                    <input class="checkbox" name="cyeditor_showgrid" id="cyeditor_showgrid" value="" type="checkbox" />
                                </div>
                            </div>
                            <div id="info"></div>
                        </div>
                       </div>`

        let {editorOptions} = this
        let editorContianer
        if (editorOptions.container) {
            if (typeof editorOptions.container === 'string') {
                editorContianer = utils.query(editorOptions.container)[ 0 ]
            } else if (utils.isNode(editorOptions.container)) {
                editorContianer = editorOptions.container
            }
            if (!editorContianer) {
                console.error('There is no any element matching your container')
                return
            }
        } else {
            editorContianer = document.createElement('div')
            document.body.appendChild(editorContianer)
        }
        editorContianer.innerHTML = domHtml
    }

    initConf () {
        utils.$('cyeditor_showgrid').checked = this.editorOptions.snapGrid
    }

    initEvents () {
        utils.$('cyeditor_showgrid').addEventListener('change', ( e ) => {
            this.toggleGrid(e.target.checked)
        })
        this.cy.on('cyeditor.noderesize-resized cyeditor.noderesize-resizing',()=>{
            this.plugins.editElements.showElementsInfo()
        })
    }

    initPlugin () {
        // edge
        this.cy.edgehandles({
            snap: true
        })
        // navigator
        this.cy.navigator({
            container: '#thumb'
        })
        // snap-grid
        this.cy.snapToGrid()

        // node resize
        let defaults = {
            handleColor: '#000000', // the colour of the handle and the line drawn from it
            enabled: true, // whether to start the plugin in the enabled state
            minNodeWidth: 30,
            minNodeHeight: 30,
            triangleSize: 10,
            selector: 'node[resize]',
            lines: 3,
            padding: 5
        }

        this.cy.noderesize(defaults)

        // drag node add to cy
        this.cy.dragAddNodes({
            container: '.shapes'
        })

        // edit panel
        this.plugins.editElements =  this.cy.editElements({
            container: '#info'
        })
    }

    toggleGrid ( on ) {
        this.cy.snapToGrid(on ? 'gridOn' : 'gridOff')
        this.cy.snapToGrid(on ? 'snapOn' : 'snapOff')
    }
}

