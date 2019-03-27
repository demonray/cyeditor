/**
 * Created by DemonRay on 2019/3/25.
 */

import cytoscape from 'cytoscape'
import edgehandles from 'cytoscape-edgehandles'
import dragAddNodes from './cyeditor-drag-add-nodes'
import cynavigator from './cyeditor-navigator'
import editElements from './cyeditor-edit-elements'
import noderesize from '././cyeditor-node-resize'
import snapGrid from '././cyeditor-snap-grid'
import utils from '../utils'
import {defaultConfData,defaultEdgeStyles,defaultNodeStyles} from '../const'
import './cyeditor-navigator/style.css'
import './index.css'

cytoscape.use(edgehandles)
cytoscape.use(cynavigator)
cytoscape.use(snapGrid)
cytoscape.use(noderesize)
cytoscape.use(dragAddNodes)
cytoscape.use(editElements)



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
            ...defaultEdgeStyles,
            ...defaultNodeStyles
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
        snapGrid: false
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
                    node.data = Object.assign({}, defaultConfData.node, node.data)
                })
            }
            if (Array.isArray(this.cyOptions.elements.edges)) {
                this.cyOptions.elements.edges.forEach(edge => {
                    edge.data = Object.assign({}, defaultConfData.edge, edge.data)
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

        if(this.editorOptions.snapGrid) {
            // snap-grid
            this.cySnapToGrid = this.cy.snapToGrid()
        }

        this.cy.noderesize({
            selector: 'node[resize]'
        })

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
        if(this.cySnapToGrid) {
            if(on ) {
                this.cySnapToGrid.gridOn()
                this.cySnapToGrid.snapOn()
            } else {
                this.cySnapToGrid.gridOff()
                this.cySnapToGrid.snapOff()
            }
        }   else if(on) {
            this.cySnapToGrid = this.cy.snapToGrid()
        }
    }
}

