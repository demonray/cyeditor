import utils from '../../utils'

const defaults = {
  menus: [
    {
      id: 'remove',
      content: 'remove',
      disabled: false,
      divider: false
    },
    {
      id: 'hide',
      content: 'hide',
      disabled: false,
      divider: false
    }
  ]
}

class ContextMenu {
  constructor (cy, params) {
    this.cy = cy
    this._options = Object.assign({}, defaults, params)
    this._listeners = {}
    this._init()
  }
  _init () {
    this._initDom()
    this._initEvents()
  }

  _initDom () {
    this._container = this.cy.container()
    this.ctxmenu = document.createElement('div')
    this.ctxmenu.className = 'cy-editor-ctx-menu'
    this._container.append(this.ctxmenu)
    let domItem = ''
    this._options.menus.forEach(item => {
      domItem += `<div class="ctx-menu-item" data-menu-item="${item.id}">${item.content}</div>`
    })
    this.ctxmenu.innerHTML = domItem
  }

  _initEvents () {
    this._listeners.eventCyTap = (event) => {
      let renderedPos = event.renderedPosition || event.cyRenderedPosition
      let left = renderedPos.x
      let top = renderedPos.y
      utils.css(this.ctxmenu, {
        top: top + 'px',
        left: left + 'px',
        display: 'block'
      })
    }
    this._listeners.eventTapstart = () => {
      utils.css(this.ctxmenu, {
        display: 'none'
      })
    }
    this._listeners.click = (e) => {
      const id = e.target.getAttribute('data-menu-item')
      const menuItem = this._options.menus.find(item => item.id === id)
      this.cy.trigger('cyeditor.ctxmenu', menuItem)
    }

    this.ctxmenu.addEventListener('mousedown', this._listeners.click)
    this.cy.on('cxttap', this._listeners.eventCyTap)
    this.cy.on('tapstart', this._listeners.eventTapstart)
  }

  destroyCxtMenu () {
    this.ctxmenu.removeEventListener('mousedown', this._listeners.click)
    this.cy.off('tapstart', this._listeners.eventTapstart)
    this.cy.off('cxttap', this._listeners.eventCyTap)
  }
}

export default (cytoscape) => {
  if (!cytoscape) {
    return
  }

  cytoscape('core', 'contextMenu', function (options) {
    return new ContextMenu(this, options)
  })
}
