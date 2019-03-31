/**
 * Created by DemonRay on 2019/3/25.
 */

import cytoscape from 'cytoscape'
import edgehandles from 'cytoscape-edgehandles'

import utils from '../utils'
import toolbar from './cyeditor-toolbar'
import snapGrid from './cyeditor-snap-grid'
import cynavigator from './cyeditor-navigator'
import noderesize from './cyeditor-node-resize'
import editElements from './cyeditor-edit-elements'
import dragAddNodes from './cyeditor-drag-add-nodes'
import { defaultConfData, defaultEdgeStyles, defaultNodeStyles, pluginStyles } from '../const'

import '../assets/css/flow.css'
import './index.css'

cytoscape.use(edgehandles)
cytoscape.use(cynavigator)
cytoscape.use(snapGrid)
cytoscape.use(noderesize)
cytoscape.use(dragAddNodes)
cytoscape.use(editElements)
cytoscape.use(toolbar)

let defaults = {
  cy: {
    container: '#cy',
    layout: {
      name: 'concentric',
      fit: false,
      concentric: function (n) { return 0 },
      minNodeSpacing: 100
    },
    style: [
      ...defaultEdgeStyles,
      ...defaultNodeStyles,
      ...pluginStyles
    ],
    minZoom: 0.1,
    maxZoom: 10,
    elements: {
      nodes: [
        { data: { id: 'j', name: 'Jerry', resize: true, bg: '#90235d' } },
        { data: { id: 'e', name: 'Elaine', resize: true, bg: '#f0545d' } },
        { data: { id: 'k', name: 'Kramer', resize: true, bg: '#9954fd' } },
        { data: { id: 'g', name: 'George', type: 'vee', bg: '#00888d' } }
      ],
      edges: [
        { data: { source: 'j', target: 'e', lineColor: '#999' } },
        { data: { source: 'j', target: 'k' } },
        { data: { source: 'j', target: 'g' } },
        { data: { source: 'e', target: 'j' } },
        { data: { source: 'e', target: 'k' } },
        { data: { source: 'k', target: 'j' } },
        { data: { source: 'k', target: 'e' } },
        { data: { source: 'k', target: 'g' } },
        { data: { source: 'g', target: 'j' } }
      ]
    }
  },
  editor: {
    snapGrid: false,
    zoomRate: 0.2,
    lineType: 'bezier'
  }
}

export default class CyEditor {
  constructor (params = defaults) {
    if (params.editor.zoomRate <= 0 || params.editor.zoomRate >= 1) {
      console.error('zoomRate must be float number, greater than 0 and less than 1')
    }
    this._plugins = {}
    this._listeners = {}
    this._initOptions(params)
    this._init()
  }

  _init () {
    this._initEditorDom()
    this._initCy()
    this._initPlugin()
    this._initEvents()
    this._initEditor()
  }

  _initOptions (params) {
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

  _initCy () {
    if (typeof this.cyOptions.container === 'string') {
      this.cyOptions.container = utils.query(this.cyOptions.container)[ 0 ]
    }
    if (!this.cyOptions.container) {
      console.error('There is no any element matching your container')
      return
    }
    this.cy = cytoscape(this.cyOptions)
  }

  _initEditorDom () {
    let domHtml = `<div id="toolbar">
                        </div>
                        <div id="editor">
                            <div class="left">
                                <div class="shapes"></div>
                            </div>
                        <div id="cy"></div>
                        <div class="right">
                            <div class="panel-title">导航器</div>
                            <div id="thumb"></div>
                            <div id="info"></div>
                        </div>
                       </div>`

    let { editorOptions } = this
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

  _initEvents () {
    this._listeners.showElementInfo = () => {
      this._plugins.editElements.showElementsInfo()
    }
    this._listeners.handleCommand = this._handleCommand.bind(this)
    this._listeners.hoverout = (e) => {
      this._plugins.edgehandles.active = true
      this._plugins.edgehandles.stop(e)
      this._plugins.noderesize.clearDraws()
    }

    this.cy.on('cyeditor.noderesize-resized cyeditor.noderesize-resizing', this._listeners.showElementInfo)
      .on('cyeditor.toolbar-command', this._listeners.handleCommand).on('click', this._listeners.hoverout)
  }

  _initEditor () {
    if (this.editorOptions.lineType !== defaults.lineType) {
      this.changeEdgeType(this.editorOptions.lineType)
    }
  }

  _initPlugin () {
    // edge
    this._plugins.edgehandles = this.cy.edgehandles({
      snap: false,
      handlePosition () {
        return 'middle middle'
      },
      edgeParams: () => {
        return {
          classes: this.editorOptions.lineType
        }
      }

    })
    // navigator
    this.cy.navigator({
      container: '#thumb'
    })

    if (this.editorOptions.snapGrid) {
      // snap-grid
      this.cySnapToGrid = this.cy.snapToGrid()
    }

    this._plugins.noderesize = this.cy.noderesize({
      selector: 'node[resize]'
    })

    // drag node add to cy
    this.cy.dragAddNodes({
      container: '.shapes'
    })

    // edit panel
    this._plugins.editElements = this.cy.editElements({
      container: '#info'
    })

    this._plugins.toolbar = this.cy.toolbar({
      container: '#toolbar'
    })
  }

  _handleCommand (evt, item) {
    switch (item.command) {
      case 'gridon' :
        this.toggleGrid()
        break
      case 'zoomin' :
        this.zoom(1)
        break
      case 'zoomout' :
        this.zoom(-1)
        break
      case 'fit' :
        this.fit()
        break
      case 'save' :
        this.save()
        break
      case 'delete' :
        this.deleteEl()
        break
      case 'line-bezier' :
        this.editorOptions.lineType = 'bezier'
        break
      case 'line-taxi' :
        this.editorOptions.lineType = 'taxi'
        break
      case 'line-straight' :
        this.editorOptions.lineType = 'straight'
        break
      case 'boxselect':
        this.cy.boxSelectionEnabled(item.selected)
        break
      default:
        break
    }
  }

  changeEdgeType (type) {
    this.cy.$('edge').addClass(type)
  }

  deleteEl () {
    let selected = this.cy.$(':selected')
    if (selected.length) {
      this.cy.remove(selected)
    }
  }

  async save () {
    try {
      let blob = await this.cy.png({ output: 'blob-promise' })
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, `chart-${Date.now()}.png`)
      } else {
        let a = document.createElement('a')
        a.download = `chart-${Date.now()}.png`
        a.href = window.URL.createObjectURL(blob)
        a.click()
      }
    } catch (e) {
      console.log(e)
    }
  }

  fit () {
    if (!this._initZoomState) {
      let pan = this.cy.pan()
      this._initZoomState = {
        ...pan
      }
    }
    this.cy.fit()
  }

  zoom (type = 1, level) {
    level = level || this.editorOptions.zoomRate
    let zoom = this.cy.zoom() * (1 + level * type)
    let w = this.cy.width()
    let h = this.cy.height()
    zoom = zoom.toFixed(4) - 0
    if (!this._initZoomState) {
      let pan = this.cy.pan()
      this._initZoomState = {
        ...pan
      }
    }
    this.cy.viewport({
      zoom,
      pan: {
        x: -1 * w * (zoom - 1) / 2 + this._initZoomState.x,
        y: -1 * h * (zoom - 1) / 2 + this._initZoomState.y
      }
    })
  }

  toggleGrid () {
    this.editorOptions.snapGrid = !this.editorOptions.snapGrid
    if (this.cySnapToGrid) {
      if (this.editorOptions.snapGrid) {
        this.cySnapToGrid.gridOn()
        this.cySnapToGrid.snapOn()
      } else {
        this.cySnapToGrid.gridOff()
        this.cySnapToGrid.snapOff()
      }
    } else if (this.editorOptions.snapGrid) {
      this.cySnapToGrid = this.cy.snapToGrid()
    }
  }

  destroy () {
    this.cy.off('cyeditor.noderesize-resized cyeditor.noderesize-resizing', this._listeners.showElementInfo)
      .off('cyeditor.toolbar-command', this._listeners.handleCommand)
  }
}
