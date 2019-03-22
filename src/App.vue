<template>
    <div id="page">
        <div id="toolbar"><div @click="del">删除</div></div>
        <div id="editor">
            <div class="left"></div>
            <div id="cy"></div>
            <div class="right">
                <div class="pannel-title">导航器</div>
                <div class="thumb-view"></div>
            </div>
        </div>
    </div>
</template>

<script>
import cytoscape from 'cytoscape'
import edgehandles from 'cytoscape-edgehandles'
import '../lib/cytoscape-navigator/style.css'

cytoscape.use(edgehandles)
cytoscape.use(require('../lib/cytoscape-navigator/index'))
cytoscape.use(require('../lib/cytoscape-snap-grid/index'))
cytoscape.use(require('../lib/cytoscape-node-resize/index'))

export default {
  name: 'App',
  components: {},
  data () {
    return {}
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
          { data: { id: 'j', name: 'Jerry' } },
          { data: { id: 'e', name: 'Elaine' } },
          { data: { id: 'k', name: 'Kramer' } },
          { data: { id: 'g', name: 'George' } }
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

    //            // edge
    //            this.cy.edgehandles({
    //                snap: true
    //            });

    // 导航器
    this.cy.navigator({
      container: '.thumb-view'
    })

    // snap-grid
    this.cy.snapToGrid()

    // node resize
    let defaults = {
      handleColor: '#000000', // the colour of the handle and the line drawn from it
      hoverDelay: 150, // time spend over a target node before it is considered a target selection
      enabled: true, // whether to start the plugin in the enabled state
      minNodeWidth: 30,
      minNodeHeight: 30,
      triangleSize: 10,
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

    this.cy.nodes().on('click', function (e) {
      let clickedNode = e.target
      console.log(clickedNode)
      console.log(clickedNode.data())
    })
    this.cy.edges().on('click', function (e) {
      let clickedNode = e.target
      console.log(clickedNode)
      // clickedNode.remove();
    })
  },
  computed: {},
  methods: {
    del () {
      if (this.cy) {
        this.cy.$(':selected').remove()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
    *, *::before, *::after {
        box-sizing: border-box;
    }
    html,body {
       width 100%
       height 100%
       margin 0px
       overflow hidden
    }
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
        height calc(100% - 42px)
        display flex
        .left {
            width: 250px;
            height: 100%;
            left: 0px;
            z-index: 2;
            background: #F7F9FB;
            padding-top: 8px;
            border-right: 1px solid #E6E9ED;
        }
        .right {
            width: 250px;
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
        }

    }

    #cy {
        flex 1
        z-index 999
    }

    .thumb-view {
        position relative
        width 100%
        height 220px
        border none
    }
</style>
