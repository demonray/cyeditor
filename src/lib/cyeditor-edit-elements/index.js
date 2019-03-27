/**
 * Created by DemonRay on 2019/3/25.
 */
import utils from '../../utils'

const defaults = {
    container: false,
    attrs: [ 'name', 'height', 'width', 'color', 'background-color' ]
}

class EditElements {
    constructor ( cy, params ) {
        this.cy = cy
        this.options = Object.assign(defaults,params)
        this.infos = {}
        this.selected = []
        this.initPanel()
        this.initEvents()
    }

    initEvents () {
        this.pannel.addEventListener('input', ( e ) => { // debounce todo
            if (this.options.attrs.indexOf(e.target.name) > -1) {
                this.infos[e.target.name] = e.target.value
                this.changeElementInfo(e.target.name, e.target.value)
            }
        })
        this.cy.on('select click', () => {
            this.showElementsInfo()
        })
    }

    initPanel () {
        let {options} = this
        if (options.container) {
            if (typeof options.container === 'string') {
                this.pannel = utils.query(options.container)[ 0 ]
            } else if (utils.isNode(options.container)) {
                this.pannel = options.container
            }
            if (!this.pannel) {
                console.error('There is no any element matching your container')
                return
            }
        } else {
            this.pannel = document.createElement('div')
            document.body.appendChild(this.pannel)
        }
        this.pannelHtml()
        this.pannel.style.display = 'none'
    }

    pannelHtml(params = {showName:true,showBgColor:true,showColor:true,showRect:true, colorTitle:'文字'}) {
        this.pannel.innerHTML = `<div class="pannel-title">元素${params.titile || ''}</div>
               <div class="pannel-body" id="info-items">
                <div class="info-item-wrap" style="${!params.showName?'display:none':''}">名称：
                    <input class="input info-item" name="name" type="text" value="">
                </div>
                <div class="info-item-wrap" style="${!params.showRect?'display:none':''}">尺寸：
                    <div class="info-item">
                        <input class="input width" name="width" autocomplete="off" type="number" step="1" value="">
                        <input class="input height" name="height" autocomplete="off" type="number" step="1" value="">
                    </div>
                </div>
                <div class="info-item-wrap" style="${!params.showColor?'display:none':''}">${params.colorTitle}：
                    <div class="info-item">
                        <input class="input color-input" name="color" autocomplete="off" type="color">
                    </div>
                </div>
                <div class="info-item-wrap" style="${!params.showBgColor?'display:none':''}">背景：
                    <div class="info-item">
                        <input class="input color-input" name="background-color" autocomplete="off" type="color">
                    </div>
                </div>          
             </div>`
    }

    changeElementInfo(name,value) {
        if(name === 'name') {
            this.selected[0].data({name:value})
            return
        }
        this.selected.forEach(item => {
            if(item.isEdge() && name === 'color') {
                name = 'lineColor'
            }
            item.data({
                [name]:value
            })
        })
    }

    showElementsInfo () {
        let selected = this.cy.$(':selected')
        let allNode = selected.every(it=>it.isNode())
        let opt = { showName: allNode,showBgColor:allNode, showColor:true, showRect:allNode, colorTitle: allNode?'文字':'颜色' }
        if (selected.length > 1) {
            this.infos.name = '';
            this.pannelHtml(opt)
        } else if (selected.length === 1) {
            this.pannelHtml(opt)
            this.pannel.style.display = 'block'
            let el = selected[0]
            this.options.attrs.forEach(item => {
                if(item === 'name') { // from data
                    this.infos[item] = el.data('name')
                } else if(item === 'color' || item === 'background-color' ) {
                    let color = el.numericStyle(item)
                    this.infos[item] = '#' + utils.RGBToHex(...color)
                } else {
                    this.infos[item] = el.numericStyle(item)
                }
            })
        } else {
            this.pannel.style.display = 'none'
        }
        this.options.attrs.filter(item=> this.infos[item] ).forEach(name=> {
            let item = utils.query(`#info-items input[name=${name}`)
            if(item.length) {
                item[0].value = this.infos[name];
            }
        })
    }
}

// registers the extension on a cytoscape lib ref
function register ( cytoscape ) {
    if (!cytoscape) { return } // can't register if cytoscape unspecified

    cytoscape('core', 'editElements', function ( params ) {
        let cy = this
        return new EditElements(cy, params)
    }) // register with cytoscape.js
}

if (typeof cytoscape !== 'undefined') { // expose to global cytoscape (i.e. window.cytoscape)
    register(cytoscape)
}

export default  register
