/**
 * Created by DemonRay on 2019/3/25.
 */
import utils from '../../utils'

const defaults = {
  container: false,
  attrs: [ 'name', 'height', 'width', 'color', 'background-color' ]
}

class EditElements {
  constructor (cy, params) {
    this.cy = cy
    this._options = Object.assign({}, defaults, params)
    this._infos = {}
    this.selected = []
    this._initPanel()
    this._initEvents()
  }

  _initEvents () {
    this._panel.addEventListener('input', (e) => { // debounce todo
      if (this._options.attrs.indexOf(e.target.name) > -1) {
        this._infos[e.target.name] = e.target.value
        this._changeElementInfo(e.target.name, e.target.value)
      }
    })
    this.cy.on('select unselect', () => {
      this.showElementsInfo()
    })
  }

  _initPanel () {
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
    this._panel.style.display = 'none'
  }

  _panelHtml (params = { showName: true, showBgColor: true, showColor: true, showRect: true, colorTitle: utils.localize('elements-text') }) {
    this._panel.innerHTML = `<div class="panel-title">${utils.localize('elements-title')}${params.title || ''}</div>
              <div class="panel-body" id="info-items">
                <div class="info-item-wrap" style="${!params.showName ? 'display:none' : ''}">${utils.localize('elements-label')}：
                    <input class="input info-item" name="name" type="text" value="">
                </div>
                <div class="info-item-wrap" style="${!params.showRect ? 'display:none' : ''}">${utils.localize('elements-wrap')}：
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
                <div class="info-item-wrap" style="${!params.showBgColor ? 'display:none' : ''}">${utils.localize('elements-background-color')}：
                    <div class="info-item">
                        <input class="input color-input" name="background-color" autocomplete="off" type="color">
                    </div>
                </div>
            </div>`
  }

  _changeElementInfo (name, value) {
    if (name === 'name') {
      this.selected[0].data({ name: value })
      return
    }
    this.selected.forEach(item => {
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

  showElementsInfo () {
    let selected = this.cy.$(':selected')
    this.selected = selected
    let allNode = selected.every(it => it.isNode())
    let opt = { showName: allNode, showBgColor: allNode, showColor: true, showRect: allNode, colorTitle: allNode ? utils.localize('elements-text-color') : utils.localize('elements-color') }
    if (selected.length > 1) {
      this._infos.name = ''
      this._panelHtml(opt)
    } else if (selected.length === 1) {
      this._panelHtml(opt)
      this._panel.style.display = 'block'
      let el = selected[0]
      this._options.attrs.forEach(item => {
        if (item === 'name') { // from data
          this._infos[item] = el.data('name')
        } else if (item === 'color' || item === 'background-color') {
          let color = el.numericStyle(item)
          this._infos[item] = '#' + utils.RGBToHex(...color)
        } else {
          this._infos[item] = el.numericStyle(item)
        }
      })
    } else {
      this._panel.style.display = 'none'
    }
    this._options.attrs.filter(item => this._infos[item]).forEach(name => {
      let item = utils.query(`#info-items input[name=${name}`)
      if (item.length) {
        item[0].value = this._infos[name]
      }
    })
  }
}

export default (cytoscape) => {
  if (!cytoscape) { return }

  cytoscape('core', 'editElements', function (params) {
    return new EditElements(this, params)
  })
}
