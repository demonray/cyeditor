/**
 * Created by DemonRay on 2019/3/28.
 */
import utils from '../../utils'

let defaults = {
  container: false,
  commands: [
    { command: 'undo', icon: 'fa-reply-outline', disabled: true, title: '撤销' },
    { command: 'redo', icon: 'fa-forward-outline', disabled: true, title: '重做' },
    { command: 'copy', icon: 'fa-docs', disabled: true, title: '复制', separator: true },
    { command: 'paste', icon: 'fa-paste', disabled: true, title: '粘贴' },
    { command: 'delete', icon: 'fa-trash-empty', disabled: true, title: '删除' },
    { command: 'zoomin', icon: 'fa-zoom-in', disabled: false, title: '放大', separator: true },
    { command: 'zoomout', icon: 'fa-zoom-out', disabled: false, title: '缩小' },
    { command: 'fit', icon: 'fa-resize-full', disabled: false, title: '适应画布' },
    { command: 'leveldown', icon: 'fa-download-1', disabled: true, title: '层级后置' },
    { command: 'levelup', icon: 'fa-upload-1', disabled: true, title: '层级前置' },
    { command: 'gridon', icon: 'fa-grid', disabled: false, title: '表格辅助', selected: false, separator: true },
    { command: 'boxselect', icon: 'fa-marquee', disabled: false, title: '框选', selected: false },
    {
      command: 'line-straight',
      icon: 'fa-flow-line',
      disabled: false,
      title: '直线',
      selected: false,
      separator: true
    },
    { command: 'line-taxi', icon: 'fa-flow-tree', disabled: false, title: '折线', selected: false },
    { command: 'line-bezier', icon: 'fa-flow-branch', disabled: false, title: '曲线', selected: false },
    { command: 'save', icon: 'fa-floppy', disabled: false, title: '保存', separator: true }
  ]
}
class Toolbar {
  constructor (cy, params) {
    this.cy = cy
    this._options = Object.assign(defaults, params)
    this._listeners = {}
    this._init()
    this._initEvents()
  }

  _init () {
    this._initShapePanel()
  }

  _initEvents () {
    this._listeners.command = (e) => {
      let command = e.target.getAttribute('data-command')
      if (!command) { return }
      this._options.commands.forEach(item => {
        if (!item.disabled) {
          if (command === 'boxselect') {
            if (item.command === command) {
              item.selected = !item.selected
            }
          } else if (command === 'gridon') {
            if (item.command === command) {
              item.selected = !item.selected
            }
          } else if ([ 'line-straight', 'line-bezier', 'line-taxi'].indexOf(command) > -1) {
            if ([ 'line-straight', 'line-bezier', 'line-taxi'].indexOf(item.command) > -1) {
              item.selected = item.command === command
            }
          } else {
            if ([ 'line-straight', 'line-bezier', 'line-taxi', 'gridon'].indexOf(command) < 0) {
              if ([ 'line-straight', 'line-bezier', 'line-taxi', 'gridon'].indexOf(item.command) < -1) {
                if (item.selected !== undefined) {
                  item.selected = !item.selected
                }
              }
            }
          }

          if (item.command === command) {
            this.cy.trigger('cyeditor.toolbar-command', item)
          }
        }
      })
      this._panelHtml()
    }
    this._panel.addEventListener('click', this._listeners.command)
    this._listeners.select = this._selectChange.bind(this)
    this.cy.on('select unselect', this._listeners.select)
  }

  _selectChange () {
    let selected = this.cy.$(':selected')
    if (selected && selected.length !== this._last_selected_length) {
      let hasSelected = selected.length > 0
      this._options.commands.forEach(item => {
        if ([ 'delete', 'copy', 'leveldown', 'levelup' ].indexOf(item.command) > -1) {
          item.disabled = !hasSelected
        }
      })
      this._panelHtml()
    }
    this._last_selected_length = selected
  }

  _initShapePanel () {
    let { _options } = this
    if (_options.container) {
      if (typeof _options.container === 'string') {
        this._panel = utils.query(_options.container)[ 0 ]
      } else if (utils.isNode(_options.container)) {
        this._panel = _options.container
      }
      if (!this._panel) {
        console.error('There is no any element matching your container')
        return
      }
    } else {
      this._panel = document.createElement('div')
      document.body.appendChild(this._panel)
    }
    this._panelHtml()
  }

  _panelHtml () {
    let icons = ''
    this._options.commands.forEach(({ command, title, icon, disabled, selected, separator }) => {
      let cls = `${icon} ${disabled ? 'disable' : ''} ${selected === true ? 'selected' : ''}`
      if (separator) icons += '<span class="separator"></span>'
      icons += `<i data-command="${command}" class="command ${cls}" title="${title}"></i>`
    })
    this._panel.innerHTML = icons
  }
}

export default (cytoscape) => {
  if (!cytoscape) { return }

  cytoscape('core', 'toolbar', function (options) {
    return new Toolbar(this, options)
  })
}
