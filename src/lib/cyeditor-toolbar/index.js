/**
 * Created by DemonRay on 2019/3/28.
 */
import utils from '../../utils'

let defaults = {
    container: false,
    commands:[
        {command:'',icon:'fa-rotate-left', disabled: true, title:''},
        {command:'',icon:'fa-rotate-right', disabled: true, title:''},
        {command:'',icon:'fa-docs', disabled: true,title:''},
        {command:'',icon:'fa-paste', disabled: true,title:''},
        {command:'delete',icon:'fa-trash-empty', disabled: true,title:'删除'},
        {command:'zoomin',icon:'fa-zoom-in', disabled: false,title:'放大'},
        {command:'zoomout',icon:'fa-zoom-out', disabled: false,title:'缩小'},
        {command:'fit',icon:'fa-resize-full', disabled: false,title:'适应画布'},
        {command:'',icon:'fa-download-1', disabled: true,title:''},
        {command:'',icon:'fa-upload-1', disabled: true,title:''},
        {command:'gridon',icon:'fa-grid', disabled: false,title:'表格辅助'},
        {command:'',icon:'fa-marquee', disabled: true,title:''},
        {command:'save',icon:'fa-floppy', disabled: false,title:'保存'}
    ]
}
class Toolbar {
    constructor ( cy, params ) {
        this.cy = cy
        this._options = Object.assign(defaults, params)
        this._listeners = {}
        this._selected = []
        this._init()
        this._initEvents()
    }
    _init() {
        this._initShapePanel()
    }
    _initEvents() {
        this._listeners.command = (e) => {
            let command = e.target.getAttribute('data-command')
            this.cy.trigger('cyeditor.toolbar-command', command || e)
        }
        this._panel.addEventListener('click',this._listeners.command)
        this._listeners.select = () => {
            this._selected = this.cy.$(':selected')
            if(this._selected && this._selected.length !== this._last_selected_length) {
                this._options.commands.forEach(item=> {
                    if(item.command === 'delete') {
                        item.disabled = this._selected.length > 0
                    }

                })
                this._panelHtml()
            }
            this._last_selected_length = this._selected
        }
        this.cy.on('select unselect', this._listeners.select)
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
    _panelHtml() {
        let icons = ''
        this._options.commands.forEach(({command,title,icon, disabled})=>{
             icons += `<i data-command="${command}" class="command ${icon} ${disabled ? 'disable' : ''}" title="${title}"></i>`
        })
        this._panel.innerHTML = icons
    }
}

export default  ( cytoscape ) => {
    if (!cytoscape) {return}

    cytoscape('core', 'toolbar', function ( options ) {
        return new Toolbar(this, options)
    })

}


