/**
 * Created by DemonRay on 2019/3/25.
 */
import utils from '../../utils'

interface Options {
  container?: string | Node
  attrs: string[]
}
const defaults = {
  attrs: ['name', 'height', 'width', 'color', 'background-color']
}

class EditElements {
  [x: string]: any
  constructor(cy: cytoscape.Core, params: Options) {
    this.cy = cy
    this._options = Object.assign({}, defaults, params)
    this._infos = {}
    this.selected = []
    this._initPanel()
    this._initEvents()
  }

  _initEvents() {
    this._panel.addEventListener('input', (e: any) => { // debounce todo
      if (this._options.attrs.indexOf(e.target.name) > -1) {
        this._infos[e.target.name] = e.target.value
        this._changeElementInfo(e.target.name, e.target.value)
      }
    })
    this.cy.on('select unselect', () => {
      this.showElementsInfo()
    })
  }

  _initPanel() {
    let { _options } = this
    if (_options.container) {
      if (typeof _options.container === 'string') {
        this._panel = utils.query(_options.container)[0]
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
    this._panel.style.display = 'none'
  }

  _panelHtml(params = { showName: true, showBgColor: true, showColor: true, showRect: true, colorTitle: '文字', title: '' }) {
    this._panel.innerHTML = `<div class="panel-title">元素${params.title || ''}</div>
              <div class="panel-body" id="info-items">
                <div class="info-item-wrap" style="${!params.showName ? 'display:none' : ''}">名称：
                    <input class="input info-item" name="name" type="text" value="">
                </div>
                <div class="info-item-wrap" style="${!params.showRect ? 'display:none' : ''}">尺寸：
                    <div class="info-item">
                        <input class="input width" name="width" autocomplete="off" type="number" step="1" value="">
                        <input class="input height" name="height" autocomplete="off" type="number" step="1" value="">
                    </div>
                </div>
                <div class="info-item-wrap" style="${!params.showColor ? 'display:none' : ''}">${params.colorTitle}：
                    <div class="info-item">
                        <input class="input color-input" name="color" autocomplete="off" type="color">
                    </div>
                </div>
                <div class="info-item-wrap" style="${!params.showBgColor ? 'display:none' : ''}">背景：
                    <div class="info-item">
                        <input class="input color-input" name="background-color" autocomplete="off" type="color">
                    </div>
                </div>
            </div>`
  }

  _changeElementInfo(name: string, value: any) {
    if (name === 'name') {
      this.selected[0].data({ name: value })
      return
    }
    this.selected.forEach((item: any) => {
      if (item.isEdge() && name === 'color') {
        name = 'lineColor'
      }
      if (name === 'background-color') {
        name = 'bg'
      }
      item.data({
        [name]: value
      })
    })
  }

  showElementsInfo() {
    let selected = this.cy.$(':selected')
    this.selected = selected
    let allNode = selected.every((it: any) => it.isNode())
    let opt: any = { showName: allNode, showBgColor: allNode, showColor: true, showRect: allNode, colorTitle: allNode ? '文字' : '颜色' }
    if (selected.length > 1) {
      this._infos.name = ''
      this._panelHtml(opt)
    } else if (selected.length === 1) {
      this._panelHtml(opt)
      this._panel.style.display = 'block'
      let el = selected[0]
      this._options.attrs.forEach((item: any) => {
        if (item === 'name') { // from data
          this._infos[item] = el.data('name')
        } else if (item === 'color' || item === 'background-color') {
          let color = el.numericStyle(item)
          this._infos[item] = '#' + utils.RGBToHex(color[0], color[2], color[2])
        } else {
          this._infos[item] = el.numericStyle(item)
        }
      })
    } else {
      this._panel.style.display = 'none'
    }
    this._options.attrs.filter((item: string) => this._infos[item]).forEach((name: string) => {
      let item: any = utils.query(`#info-items input[name=${name}`)
      if (item.length) {
        item[0].value = this._infos[name]
      }
    })
  }
}

export default (cy?: any) => {
  if (!cy) { return }

  cy('core', 'editElements', function (this: cytoscape.Core, params: Options = defaults) {
    return new EditElements(this, params)
  })
}
