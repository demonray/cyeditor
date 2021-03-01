import utils from '../../utils'

interface MenuItem {
  id: string,
  content: string,
  disabled: boolean,
  divider?: boolean,
  onClick?: () => any
}
interface Options {
  menus: MenuItem[],
  beforeShow: () => boolean
  beforeClose: () => boolean
}

const defaults = {
  menus: [],
  beforeShow() { return true },
  beforeClose() { return true }
}

class ContextMenu {
  [x: string]: any
  constructor(cy: cytoscape.Core, params: any) {
    this.cy = cy
    this._options = Object.assign({}, params)
    this._listeners = {}
    this.init()
  }
  init() {
    this.initContainer()
    this.initDom()
    this.initEvents()
  }

  public disable(id: string, disabled = true) {
    const items = utils.query(`.cy-editor-ctx-menu [data-menu-item=${id}]`)
    items.forEach((menuItem) => {
      if (disabled) {
        utils.addClass(menuItem, 'ctx-menu-item-disabled')
      } else {
        utils.removeClass(menuItem, 'ctx-menu-item-disabled')
      }
    })
  }

  public changeMenus(menus: MenuItem[]) {
    this._options.menus = menus
    this.initDom()
  }

  public show(e: cytoscape.EventObject) {
    if (!this.isShow) {
      const show = this._options.beforeShow(e, this._options.menus.slice(0))
      if (!show) return
      if (show && show.then) {
        show.then((res: boolean) => {
          if (res) {
            utils.css(this.ctxmenu, {
              display: 'block'
            })
            this.isShow = true
          }
        })
        return
      }
      if (Array.isArray(show)) {
        this.changeMenus(show)
      }
      utils.css(this.ctxmenu, {
        display: 'block'
      })
      this.isShow = true
    }
  }

  public close(e: cytoscape.EventObject) {
    if (this.isShow) {
      const close = this._options.beforeClose(e)
      if (close === true) {
        utils.css(this.ctxmenu, {
          display: 'none'
        })
        this.isShow = false
      } else if (close.then) {
        close.then(() => {
          utils.css(this.ctxmenu, {
            display: 'none'
          })
          this.isShow = false
        })
      }
    }
  }

  public destroy() {
    this.ctxmenu.removeEventListener('mousedown', this._listeners.click)
    this.cy.off('tapstart', this._listeners.eventTapstart)
    this.cy.off('cxttap', this._listeners.eventCyTap)
  }

  private initContainer() {
    this._container = this.cy.container()
    this.ctxmenu = document.createElement('div')
    this.ctxmenu.className = 'cy-editor-ctx-menu'
    this._container.append(this.ctxmenu)
  }

  private initDom() {
    let domItem = ''
    this._options.menus.forEach((item: MenuItem) => {
      domItem += `<div class="ctx-menu-item ${item.disabled ? 'ctx-menu-item-disabled' : ''}" data-menu-item="${item.id}">${item.content}</div>`
      if (item.divider) {
        domItem += '<div class="ctx-menu-divider" ></div>'
      }
    })
    this.ctxmenu.innerHTML = domItem
  }

  private initEvents() {
    this._listeners.eventCyTap = (event: cytoscape.EventObject) => {
      let renderedPos = event.renderedPosition
      let left = renderedPos.x
      let top = renderedPos.y
      utils.css(this.ctxmenu, {
        top: top + 'px',
        left: left + 'px'
      })
      this.clickTarget = event.target
      this.show(event)
    }
    this._listeners.eventTapstart = (e: cytoscape.EventObject) => {
      this.close(e)
    }
    this._listeners.click = (e: cytoscape.EventObject) => {
      let tapNodeData
      if (this.clickTarget) {
        tapNodeData = {
          isNode: this.clickTarget.isNode(),
          isEdge: this.clickTarget.isEdge(),
          data: this.clickTarget.data()
        }
      }
      const id = e.target.getAttribute('data-menu-item')
      const menuItem = this._options.menus.find((item: MenuItem) => item.id === id)
      if (menuItem && menuItem.onClick) {
        menuItem.onClick(tapNodeData)
      }
      this.cy.trigger('cyeditor.ctxmenu', menuItem, tapNodeData)
    }

    this.ctxmenu.addEventListener('mousedown', this._listeners.click)
    this.cy.on('cxttap', 'node,edge', this._listeners.eventCyTap)
    this.cy.on('tapstart', this._listeners.eventTapstart)
  }
}

export default (cy?: any) => {
  if (!cy) {
    return
  }

  cy('core', 'contextMenu', function (this: cytoscape.Core, options: Options) {
    return new ContextMenu(this, Object.assign({...defaults}, options))
  })
}
