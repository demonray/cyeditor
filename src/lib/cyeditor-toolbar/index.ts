/**
 * Created by DemonRay on 2019/3/28.
 */
import utils from '../../utils'

let defaults = {
  container: false,
  commands: [
    { command: 'undo', icon: 'icon-undo', disabled: true, title: '撤销' },
    { command: 'redo', icon: 'icon-Redo', disabled: true, title: '重做' },
    { command: 'zoomin', icon: 'icon-zoomin', disabled: false, title: '放大', separator: true },
    { command: 'zoomout', icon: 'icon-zoom', disabled: false, title: '缩小' },
    { command: 'boxselect', icon: 'icon-selection', disabled: false, title: '框选', selected: false },
    { command: 'copy', icon: 'icon-copy', disabled: true, title: '复制', separator: true },
    { command: 'paste', icon: 'icon-paste', disabled: true, title: '粘贴' },
    { command: 'delete', icon: 'icon-delete', disabled: true, title: '删除' },
    { command: 'leveldown', icon: 'icon-arrow-to-bottom', disabled: true, title: '层级后置' },
    { command: 'levelup', icon: 'icon-top-arrow-from-top', disabled: true, title: '层级前置' },
    { command: 'line-straight', icon: 'icon-Line-Tool', disabled: false, title: '直线', selected: false, separator: true },
    { command: 'line-taxi', icon: 'icon-gongzuoliuchengtu', disabled: false, title: '折线', selected: false },
    { command: 'line-bezier', icon: 'icon-Bezier-', disabled: false, title: '曲线', selected: false },
    { command: 'gridon', icon: 'icon-grid', disabled: false, title: '表格辅助', selected: false, separator: true },
    { command: 'fit', icon: 'icon-fullscreen', disabled: false, title: '适应画布' },
    { command: 'save', icon: 'icon-save', disabled: false, title: '保存', separator: true }
  ]
}
class Toolbar {
  [x: string]: any
  constructor (cy, params) {
    this.cy = cy
    this._init(params)
    this._listeners = {}
    this._initEvents()
  }

  _init (params) {
    this._options = Object.assign({}, defaults, params)
    if (Array.isArray(this._options.toolbar)) {
      this._options.commands = this._options.commands.filter(item => this._options.toolbar.indexOf(item.command) > -1)
    }

    this._initShapePanel()
  }

  _initEvents () {
    this._listeners.command = (e) => {
      let command = e.target.getAttribute('data-command')
      if (!command) { return }
      let commandOpt = this._options.commands.find(it => it.command === command)
      if (['boxselect', 'gridon'].indexOf(command) > -1) {
        this.rerender(command, { selected: !commandOpt.selected })
      } else if (['line-straight', 'line-bezier', 'line-taxi'].indexOf(command) > -1) {
        this.rerender('line-straight', { selected: command === 'line-straight' })
        this.rerender('line-bezier', { selected: command === 'line-bezier' })
        this.rerender('line-taxi', { selected: command === 'line-taxi' })
      } else if (command === 'fit') {
        this.rerender('fit', { icon: commandOpt.icon === 'icon-fullscreen' ? 'icon-fullscreen-exit' : 'icon-fullscreen' })
      }
      if (commandOpt) {
        this.cy.trigger('cyeditor.toolbar-command', commandOpt)
      }
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
      icons += `<i data-command="${command}" class="iconfont command ${cls}" title="${title}"></i>`
    })
    this._panel.innerHTML = icons
  }

  rerender (cmd, options = {}) {
    let cmdItem = this._options.commands.find(it => it.command === cmd)
    let opt = Object.assign(cmdItem, options)
    if (opt) {
      let iconEls = utils.query(`i[data-command=${cmd}]`)
      iconEls.forEach(item => {
        if (item.parentNode === this._panel) {
          if (opt.icon) {
            item.className = `iconfont command ${opt.icon}`
          }
          if (opt.disabled) {
            utils.addClass(item, 'disable')
          } else {
            utils.removeClass(item, 'disable')
          }
          if (opt.selected) {
            utils.addClass(item, 'selected')
          } else {
            utils.removeClass(item, 'selected')
          }
        }
      })
    }
  }
}

export default (cytoscape) => {
  if (!cytoscape) { return }

  cytoscape('core', 'toolbar', function (options) {
    return new Toolbar(this, options)
  })
}
