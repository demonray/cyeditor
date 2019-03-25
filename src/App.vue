<template>
    <div id="page">
        <div id="toolbar">
            <div @click="del">删除</div>
        </div>
        <div id="editor">
            <div class="left">
                <div class="shapes">
                    <div class="shape-item">
                    ddd
                    </div>
                    <div class="shape-item">
                        dff
                    </div>
                </div>
            </div>
            <div id="cy"></div>
            <div class="right">
                <div class="pannel-title">导航器</div>
                <div id="thumb"></div>
                <div class="pannel-title">画布</div>
                <div class="pannel-body">
                    <div class="p">网格对齐：
                        <input v-model="showGrid" @change="toggleGrid" class="checkbox" name="grid" id="grid" type="checkbox" />
                    </div>
                </div>
                <div class="pannel-title">节点</div>
                <div id="info" class="pannel-body">
                    <div class="p">名称：
                        <input class="input info-item" type="text" value="常规节点">
                    </div>
                    <div class="p">尺寸：
                        <div class="info-item">
                            <input class="input width" autocomplete="off" type="number" step="1" value="80">
                            <input class="input height" autocomplete="off" type="number" step="1" value="80">
                        </div>
                    </div>
                    <div class="p">颜色：
                        <input class="input info-item color-input" autocomplete="off" type="color">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import cytoscape from 'cytoscape'
import edgehandles from 'cytoscape-edgehandles'
import dragAddNodes from './lib/cytoscape-drag-add-nodes/index'
import './lib/cytoscape-navigator/style.css'

cytoscape.use(edgehandles)
cytoscape.use(require('./lib/cytoscape-navigator/index'))
cytoscape.use(require('./lib/cytoscape-snap-grid/index'))
cytoscape.use(require('./lib/cytoscape-node-resize/index'))
cytoscape.use(dragAddNodes)

export default {
  name: 'App',
  components: {},
  data () {
    return {
        showGrid: true
    }
  },
  mounted () {
    this.cy = cytoscape({
      container: document.getElementById('cy'),
      layout: {
        name: 'concentric',
        fit: false,
        concentric: function (n) { return n.id() === 'j' ? 200 : 0 },
        levelWidth: function (nodes) { return 100 },
        minNodeSpacing: 100
      },
      style: [
        {
          'selector': 'node[type]',
          'style': {
            'shape': 'data(type)',
            'label': 'data(type)',
            'height': 40,
            'width': 40,
            'text-valign': 'center',
            'text-halign': 'center'

          }
        }, {
          'selector': 'node[points]',
          'style': {
            'shape-polygon-points': 'data(points)',
            'label': 'polygon\n(custom points)',
            'text-wrap': 'wrap'
          }
        },
        {
          selector: 'node[name]',
          style: {
            'content': 'data(name)'
          }
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle'
          }
        },
        // some style for the extension
        {
          selector: '.eh-handle',
          style: {
            'background-color': 'red',
            'width': 12,
            'height': 12,
            'shape': 'ellipse',
            'overlay-opacity': 0,
            'border-width': 12, // makes the handle easier to hit
            'border-opacity': 0
          }
        },
        {
          selector: '.eh-hover',
          style: {
            'background-color': 'red'
          }
        },
        {
          selector: '.eh-source',
          style: {
            'border-width': 2,
            'border-color': 'red'
          }
        },
        {
          selector: '.eh-target',
          style: {
            'border-width': 2,
            'border-color': 'red'
          }
        },
        {
          selector: '.eh-preview, .eh-ghost-edge',
          style: {
            'background-color': 'red',
            'line-color': 'red',
            'target-arrow-color': 'red',
            'source-arrow-color': 'red'
          }
        },
        {
          selector: '.eh-ghost-edge.eh-preview-active',
          style: {
            'opacity': 0
          }
        }
      ],
      elements: {
        nodes: [
          { data: { id: 'j', name: 'Jerry', resize: true } },
          { data: { id: 'e', name: 'Elaine', resize: true } },
          { data: { id: 'k', name: 'Kramer', resize: true } },
          { data: { id: 'g', name: 'George', type: 'vee' }}
        ],
        edges: [
          { data: { source: 'j', target: 'e' } },
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
    })

    // edge
    this.cy.edgehandles({
      snap: true
    })

    // 导航器
    this.cy.navigator({
      container: '#thumb'
    })

    // snap-grid
    this.cy.snapToGrid()


    // node resize
    let defaults = {
      handleColor: '#000000', // the colour of the handle and the line drawn from it
      enabled: true, // whether to start the plugin in the enabled state
      minNodeWidth: 30,
      minNodeHeight: 30,
      triangleSize: 10,
      selector: 'node[resize]',
      lines: 3,
      padding: 5,

      start: function (sourceNode) {
        // fired when noderesize interaction starts (drag on handle)
      },
      complete: function (sourceNode, targetNodes, addedEntities) {
        // fired when noderesize is done and entities are added
      },
      stop: function (sourceNode) {
        // fired when noderesize interaction is stopped (either complete with added edges or incomplete)
      }
    }

    this.cy.noderesize(defaults)
    //this.cy.noderesize('drawon')

    // drag node add to cy
    this.cy.dragAddNodes({
        container: '.shapes'
    });

    this.initShapes()
    this.initEvents()
  },
  computed: {},
  methods: {
    del () {
      if (this.cy) {
        this.cy.$(':selected').remove()
      }
    },
    initShapes() {
    },
    initEvents() {
        this.cy.on('dragAddNodes.add',(node) => {
            this.cy.noderesize('reInit')
        })

    },
    toggleGrid(){
        this.cy.snapToGrid(this.showGrid ? 'gridOn' : 'gridOff')
        this.cy.snapToGrid(this.showGrid ? 'snapOn' : 'snapOff')
    }
  }
}
</script>

<style scoped lang="stylus">
    #page {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        user-select: none;
    }

    #toolbar {
        padding: 8px 0px;
        width: 100%;
        border: 1px solid #E9E9E9;
        height: 42px;
        z-index: 3;
        box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
        position: absolute;
    }

    #editor {
        position: absolute;
        top: 42px;
        width 100%
        bottom 0;
        display flex
        .left {
            width: 250px;
            height: 100%;
            left: 0px;
            z-index: 2;
            background: #F7F9FB;
            border-right: 1px solid #E6E9ED;
            .shapes {
                margin: 16px 8px
            }
        }
        .right {
            width: 220px;
            height: 100%;
            right: 0px;
            z-index: 2;
            background: #F7F9FB;
            border-left: 1px solid #E6E9ED;
            .pannel-title {
                height: 32px;
                border-top: 1px solid #DCE3E8;
                border-bottom: 1px solid #DCE3E8;
                background: #EBEEF2;
                color: #000;
                line-height: 28px;
                padding-left: 12px;

            }
            .pannel-body {
                padding: 16px 8px
                .p {
                    padding-bottom: 12px;
                }
            }
            .checkbox {
                width 16px
                height 16px
                box-sizing border-box
                padding 0
                margin 0
                vertical-align text-bottom
            }
            .input {
                box-sizing: border-box;
                margin: 0;
                list-style: none;
                position: relative;
                display: inline-block;
                padding: 2px 6px;
                width: 100%;
                height: 26px;
                line-height: 1.5;
                color: rgba(0, 0, 0, 0.65);
                background-color: #fff;
                background-image: none;
                border: 1px solid #d9d9d9;
                border-radius: 4px;
                transition: all .3s;
                -webkit-appearance: none
                outline none
            }
            .input:hover {
                border-color: #40a9ff;
                -webkit-appearance: none
            }
            .info-item {
                display inline-block;
                width 140px;
                margin-left 16px;
            }
            .input.width {
                width 60px
                margin-right 18px
            }
            .input.height {
                width 60px
            }
            .color-input {
                width 24px
                padding 0
            }
        }
    }

    #cy {
        flex 1
        z-index 999
    }

    #thumb {
        position relative
        width 200px
        margin 10px auto
        height 160px
        border none
    }
</style>
