/**
 * Created by DemonRay on 2019/3/25.
 */

import cytoscape from 'cytoscape'
import utils from '../utils'
import toolbar from './cyeditor-toolbar'
import snapGrid from './cyeditor-snap-grid'
import undoRedo from './cyeditor-undo-redo'
import clipboard from './cyeditor-clipboard'
import cynavigator from './cyeditor-navigator'
import edgehandles from './cyeditor-edgehandles'
import noderesize from './cyeditor-node-resize'
import editElements from './cyeditor-edit-elements'
import dragAddNodes from './cyeditor-drag-add-nodes'
import contextMenu from './cyeditor-context-menu'
import { defaultConfData, defaultEditorConfig, defaultNodeTypes } from '../defaults'

cytoscape.use(edgehandles)
cytoscape.use(cynavigator)
cytoscape.use(snapGrid)
cytoscape.use(noderesize)
cytoscape.use(dragAddNodes)
cytoscape.use(editElements)
cytoscape.use(toolbar)
cytoscape.use(clipboard)
cytoscape.use(undoRedo)
cytoscape.use(contextMenu)

export default class CyEditor {
  constructor (params = defaultEditorConfig) {
    this._plugins = {}
    this._listeners = {}
    this._initOptions(params)
    this._init()
  }

  _init () {
    this._initDom()
    this._initCy()
    this._initPlugin()
    this._initEvents()
    this._initEditor()
  }

  _initOptions (params = {}) {
    this.editorOptions = Object.assign({}, defaultEditorConfig.editor, params.editor)
    if (this.editorOptions.nodeTypes && this.editorOptions.nodeTypesConcat && this.editorOptions.nodeTypes) {
      this.editorOptions.nodeTypes = defaultNodeTypes.concat(this.editorOptions.nodeTypes)
    }
    if (this.editorOptions.zoomRate <= 0 || this.editorOptions.zoomRate >= 1) {
      console.error('zoomRate must be float number, greater than 0 and less than 1')
    }
    this.cyOptions = Object.assign({}, defaultEditorConfig.cy, params.cy)
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

  _initDom () {
    let { dragAddNodes, navigator, elementsInfo, toolbar, container } = this.editorOptions
    let left = dragAddNodes ? `<div class="left"></div>` : ''
    let navigatorDom = navigator ? `<div class="panel-title">导航器</div><div id="thumb"></div>` : ''
    let infoDom = elementsInfo ? `<div id="info"></div>` : ''
    let domHtml = toolbar ? '<div id="toolbar"></div>' : ''
    let right = ''
    if (navigator || elementsInfo) {
      right = `<div class="right">
                ${navigatorDom}
                ${infoDom}
              </div>`
    }
    domHtml += `<div id="editor">
                ${left}
                <div id="cy"></div>
                ${right}
              </div>`
    let editorContianer
    this.cyOptions.container = '#cy'
    if (container) {
      if (typeof container === 'string') {
        editorContianer = utils.query(container)[ 0 ]
      } else if (utils.isNode(container)) {
        editorContianer = container
      }
      if (!editorContianer) {
        console.error('There is no any element matching your container')
        return
      }
    } else {
      editorContianer = document.createElement('div')
      editorContianer.className = 'cy-editor-container'
      document.body.appendChild(editorContianer)
    }
    editorContianer.innerHTML = domHtml
  }

  _initEvents () {
    this._listeners.showElementInfo = () => {
      if (this._plugins.editElements) {
        this._plugins.editElements.showElementsInfo()
      }
    }
    this._listeners.handleCommand = this._handleCommand.bind(this)
    this._listeners.hoverout = (e) => {
      if (this._plugins.edgehandles) {
        this._plugins.edgehandles.active = true
        this._plugins.edgehandles.stop(e)
      }
      if (this._plugins.noderesize) {
        this._plugins.noderesize.clearDraws()
      }
    }
    this._listeners.select = (e) => {
      if (this._doAction === 'select') return
      if (this._plugins.undoRedo) {
        this._undoRedoAction('select', e.target)
      }
    }

    this._listeners.addEles = (evt, el) => {
      el.firstTime = true
      if (!this._hook('beforeAdd', el, true)) return
      if (this._plugins.undoRedo) {
        this._undoRedoAction('add', el)
      } else {
        this.cy.add(el)
      }
      this._hook('afterAdd', el)
    }
    this._listeners._changeUndoRedo = this._changeUndoRedo.bind(this)
    this.cy.on('cyeditor.noderesize-resized cyeditor.noderesize-resizing', this._listeners.showElementInfo)
      .on('cyeditor.toolbar-command', this._listeners.handleCommand)
      .on('click', this._listeners.hoverout)
      .on('select', this._listeners.select)
      .on('cyeditor.addnode', this._listeners.addEles)
      .on('cyeditor.afterDo cyeditor.afterRedo cyeditor.afterUndo', this._listeners._changeUndoRedo)
  }

  _initEditor () {
    if (this.editorOptions.lineType !== defaultEditorConfig.lineType) {
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

    // drag node add to cy
    if (this.editorOptions.dragAddNodes) {
      this._plugins.dragAddNodes = this.cy.dragAddNodes({
        container: '.left',
        nodeTypes: this.editorOptions.nodeTypes
      })
    }

    // edit panel
    if (this.editorOptions.elementsInfo) {
      this._plugins.editElements = this.cy.editElements({
        container: '#info'
      })
    }

    // toolbar
    if (this.editorOptions.toolbar) {
      this._plugins.toolbar = this.cy.toolbar({
        container: '#toolbar',
        toolbar: this.editorOptions.toolbar
      })
      this.editorOptions.snapGrid = this.editorOptions.toolbar === true ||
        this.editorOptions.toolbar.indexOf('gridon') > -1
    }

    let needUndoRedo = this.editorOptions.toolbar === true
    let needClipboard = this.editorOptions.toolbar === true
    if (Array.isArray(this.editorOptions.toolbar)) {
      needUndoRedo = this.editorOptions.toolbar.indexOf('undo') > -1 ||
      this.editorOptions.toolbar.indexOf('redo') > -1
      needClipboard = this.editorOptions.toolbar.indexOf('copy') > -1 ||
      this.editorOptions.toolbar.indexOf('paset') > -1
    }

    // clipboard
    if (needClipboard) {
      this._plugins.clipboard = this.cy.clipboard()
    }
    // undo-redo
    if (needUndoRedo) {
      this._plugins.undoRedo = this.cy.undoRedo()
    }

    // snap-grid
    if (this.editorOptions.snapGrid) {
      this._plugins.cySnapToGrid = this.cy.snapToGrid()
    }

    // navigator
    if (this.editorOptions.navigator) {
      this.cy.navigator({
        container: '#thumb'
      })
    }

    // noderesize
    if (this.editorOptions.noderesize) {
      this._plugins.noderesize = this.cy.noderesize({
        selector: 'node[resize]'
      })
    }

    // context-menu
    if (this.editorOptions.contextMenu) {
      this._plugins.contextMenu = this.cy.contextMenu()
    }
  }

  _handleCommand (evt, item) {
    switch (item.command) {
      case 'undo' :
        this.undo()
        break
      case 'redo' :
        this.redo()
        break
      case 'gridon' :
        this.toggleGrid()
        break
      case 'zoomin' :
        this.zoom(1)
        break
      case 'zoomout' :
        this.zoom(-1)
        break
      case 'levelup' :
        this.changeLevel(1)
        break
      case 'leveldown' :
        this.changeLevel(-1)
        break
      case 'copy' :
        this.copy()
        break
      case 'paste' :
        this.paste()
        break
      case 'fit' :
        this.fit()
        break
      case 'save' :
        this.save()
        break
      case 'delete' :
        this.deleteSelected()
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
        this.cy.userPanningEnabled(!item.selected)
        this.cy.boxSelectionEnabled(item.selected)
        break
      default:
        break
    }
  }

  _changeUndoRedo () {
    if (!this._plugins.undoRedo || !this._plugins.toolbar) return
    let canRedo = this._plugins.undoRedo.isRedoStackEmpty()
    let canUndo = this._plugins.undoRedo.isUndoStackEmpty()
    if (canRedo !== this.lastCanRedo || canUndo !== this.lastCanUndo) {
      this._plugins.toolbar.rerender('undo', { disabled: canUndo })
      this._plugins.toolbar.rerender('redo', { disabled: canRedo })
    }
    this.lastCanRedo = canRedo
    this.lastCanUndo = canUndo
  }

  _undoRedoAction (cmd, options) {
    this._doAction = cmd
    this._plugins.undoRedo.do(cmd, options)
  }

  _hook (hook, params, result = false) {
    if (typeof this.editorOptions[hook] === 'function') {
      const res = this.editorOptions[hook](params)
      return result ? res : true
    }
  }

  undo () {
    if (this._plugins.undoRedo) {
      let stack = this._plugins.undoRedo.getRedoStack()
      if (stack.length) {
        this._doAction = stack[stack.length - 1].action
      }
      this._plugins.undoRedo.undo()
    } else {
      console.warn('Can not `undo`, please check the initialize option `editor.toolbar`')
    }
  }

  redo () {
    if (this._plugins.undoRedo) {
      let stack = this._plugins.undoRedo.getUndoStack()
      if (stack.length) {
        this._doAction = stack[stack.length - 1].action
      }
      this._plugins.undoRedo.redo()
    } else {
      console.warn('Can not `redo`, please check the initialize option `editor.toolbar`')
    }
  }

  copy () {
    if (this._plugins.clipboard) {
      let selected = this.cy.$(':selected')
      if (selected.length) {
        this._cpids = this._plugins.clipboard.copy(selected)
        if (this._cpids && this._plugins.toolbar) {
          this._plugins.toolbar.rerender('paste', { disabled: false })
        }
      }
    } else {
      console.warn('Can not `copy`, please check the initialize option `editor.toolbar`')
    }
  }

  paste () {
    if (this._plugins.clipboard) {
      if (this._cpids) {
        this._plugins.clipboard.paste(this._cpids)
      }
    } else {
      console.warn('Can not `paste`, please check the initialize option `editor.toolbar`')
    }
  }

  changeLevel (type = 0) {
    let selected = this.cy.$(':selected')
    if (selected.length) {
      selected.forEach(el => {
        let pre = el.style()
        el.style('z-index', pre.zIndex - 0 + type > -1 ? pre.zIndex - 0 + type : 0)
      })
    }
  }

  changeEdgeType (type) {
    this.cy.$('edge').addClass(type)
  }

  deleteSelected () {
    let selected = this.cy.$(':selected')
    if (selected.length) {
      if (this._plugins.undoRedo) {
        this._undoRedoAction('remove', selected)
      }
      this.cy.remove(selected)
    }
  }

  async save () {
    if (this._hook('save')) return
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
    if (this._hook('fit', this._fit_status = !this._fit_status)) return
    if (this._fit_status) {
      this.cy.viewport({
        zoom: this._fit_status.zoom,
        pan: this._fit_status.pan
      })
      this._fit_status = null
    } else {
      this._fit_status = { pan: this.cy.pan(), zoom: this.cy.zoom() }
      this.cy.fit()
    }
  }

  zoom (type = 1, level) {
    level = level || this.editorOptions.zoomRate
    let w = this.cy.width()
    let h = this.cy.height()
    let zoom = this.cy.zoom() + level * type
    let pan = this.cy.pan()
    pan.x = pan.x + -1 * w * level * type / 2
    pan.y = pan.y + -1 * h * level * type / 2
    this.cy.viewport({
      zoom,
      pan
    })
  }

  toggleGrid () {
    if (this._plugins.cySnapToGrid) {
      this.editorOptions.snapGrid = !this.editorOptions.snapGrid
      if (this.editorOptions.snapGrid) {
        this._plugins.cySnapToGrid.gridOn()
        this._plugins.cySnapToGrid.snapOn()
      } else {
        this._plugins.cySnapToGrid.gridOff()
        this._plugins.cySnapToGrid.snapOff()
      }
    } else {
      console.warn('Can not `toggleGrid`, please check the initialize option')
    }
  }

  jpg (opt = {}) {
    return this.cy.png(opt)
  }

  png (opt) {
    return this.cy.png(opt)
  }
  /**
   * Export the graph as JSON or Import the graph as JSON
   * @param {*} opt params for cy.json(opt)
   * @param {*} keys JSON Object keys
   */
  json (opt = false, keys) {
    keys = keys || ['boxSelectionEnabled', 'elements', 'pan', 'panningEnabled', 'userPanningEnabled', 'userZoomingEnabled', 'zoom', 'zoomingEnabled']
    // export
    let json = {}
    if (typeof opt === 'boolean') {
      let cyjson = this.cy.json(opt)
      keys.forEach(key => { json[key] = cyjson[key] })
      return json
    }
    // import
    if (typeof opt === 'object') {
      json = {}
      keys.forEach(key => { json[key] = opt[key] })
    }
    return this.cy.json(json)
  }

  /**
   * get or set data
   * @param {string|object} name
   * @param {*} value
   */
  data (name, value) {
    return this.cy.data(name, value)
  }

  /**
   *  remove data
   * @param {string} names  split by space
   */
  removeData (names) {
    this.cy.removeData(names)
  }

  destroy () {
    this.cy.off('cyeditor.noderesize-resized cyeditor.noderesize-resizing', this._listeners.showElementInfo)
      .off('cyeditor.toolbar-command', this._listeners.handleCommand)
  }
}
