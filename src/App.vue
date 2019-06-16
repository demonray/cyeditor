<template>
  <div id="page">
  </div>
</template>

<script>
import './assets/index.css'
import CyEditor from './lib'

export default {
  name: 'App',
  components: {},
  data () {
    return {}
  },
  mounted () {
    this.initEditor()
  },
  computed: {},
  methods: {
    initEditor () {
      this.cyEditor = new CyEditor({
        cy: {
          elements: {
            nodes: [{
              data: {
                id: 'j',
                name: 'Jerry',
                resize: true,
                bg: '#90235d',
                image: 'https://live.staticflickr.com/2660/3715569167_7e978e8319_b.jpg'
              }
            },
            {
              data: {
                id: 'e',
                name: 'Elaine',
                resize: true,
                bg: '#f0545d'
              }
            },
            {
              data: {
                id: 'k',
                name: 'Kramer',
                resize: true,
                bg: '#9954fd'
              }
            },
            {
              data: {
                id: 'g',
                name: 'George',
                type: 'vee',
                bg: '#00888d'
              }
            }
            ],
            edges: [{
              data: {
                source: 'j',
                target: 'e',
                lineColor: '#999'
              }
            },
            {
              data: {
                source: 'j',
                target: 'k'
              }
            },
            {
              data: {
                source: 'j',
                target: 'g'
              }
            },
            {
              data: {
                source: 'e',
                target: 'j'
              }
            },
            {
              data: {
                source: 'e',
                target: 'k'
              }
            },
            {
              data: {
                source: 'k',
                target: 'j'
              }
            },
            {
              data: {
                source: 'k',
                target: 'e'
              }
            },
            {
              data: {
                source: 'k',
                target: 'g'
              }
            },
            {
              data: {
                source: 'g',
                target: 'j'
              }
            }
            ]
          }
        },
        editor: {
          nodeTypes: [{
            type: 'ellipse',
            src: 'https://live.staticflickr.com/2660/3715569167_7e978e8319_b.jpg',
            resize: true
          }]
        }
      })
      this.test()
    },
    test () {
      setTimeout(() => {
        let json = this.cyEditor.json()
        console.log(json)
        // eg:
        json = {
          'boxSelectionEnabled': true,
          'elements': {
            'nodes': [{
              'data': {
                'type': 'rectangle',
                'bg': '#90235d',
                'resize': true,
                'name': 'Jerry',
                'width': 80,
                'height': 80,
                'image': 'https://live.staticflickr.com/2660/3715569167_7e978e8319_b.jpg',
                'id': 'j'
              },
              'position': {
                'x': 472.5,
                'y': 122.5
              },
              'group': 'nodes',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': ''
            }, {
              'data': {
                'type': 'rectangle',
                'bg': '#f0545d',
                'resize': true,
                'name': 'Elaine',
                'width': 80,
                'height': 80,
                'image': '',
                'id': 'e'
              },
              'position': {
                'x': 612.5,
                'y': 227.5
              },
              'group': 'nodes',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': ''
            }, {
              'data': {
                'type': 'rectangle',
                'bg': '#9954fd',
                'resize': true,
                'name': 'Kramer',
                'width': 80,
                'height': 80,
                'image': '',
                'id': 'k'
              },
              'position': {
                'x': 472.5,
                'y': 367.5
              },
              'group': 'nodes',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': ''
            }, {
              'data': {
                'type': 'vee',
                'bg': '#00888d',
                'resize': true,
                'name': 'George',
                'width': 80,
                'height': 80,
                'image': '',
                'id': 'g'
              },
              'position': {
                'x': 367.5,
                'y': 227.5
              },
              'group': 'nodes',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': ''
            }, {
              'data': {
                'id': 'e9262c16-2187-46dd-a1b2-98f8d8f1e8e9'
              },
              'position': {
                'x': 472.5,
                'y': 122.5
              },
              'group': 'nodes',
              'removed': false,
              'selected': false,
              'selectable': false,
              'locked': false,
              'grabbable': false,
              'classes': 'eh-handle'
            }],
            'edges': [{
              'data': {
                'lineColor': '#999',
                'source': 'j',
                'target': 'e',
                'id': '0a5d2c1a-c13d-4074-be85-ad703cc979a0'
              },
              'position': {
                'x': 0,
                'y': 0
              },
              'group': 'edges',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': 'bezier'
            }, {
              'data': {
                'lineColor': '#999',
                'source': 'j',
                'target': 'k',
                'id': '615e6a69-ab17-4335-a7bc-8b3dda60ff7e'
              },
              'position': {
                'x': 0,
                'y': 0
              },
              'group': 'edges',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': 'bezier'
            }, {
              'data': {
                'lineColor': '#999',
                'source': 'j',
                'target': 'g',
                'id': 'b1fccad5-21a0-4b5a-8f65-081345795693'
              },
              'position': {
                'x': 0,
                'y': 0
              },
              'group': 'edges',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': 'bezier'
            }, {
              'data': {
                'lineColor': '#999',
                'source': 'e',
                'target': 'j',
                'id': '973e515a-b67c-419a-be19-fabf4b321174'
              },
              'position': {
                'x': 0,
                'y': 0
              },
              'group': 'edges',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': 'bezier'
            }, {
              'data': {
                'lineColor': '#999',
                'source': 'e',
                'target': 'k',
                'id': 'a6fa7578-d1a4-4118-a21e-291bb61b2277'
              },
              'position': {
                'x': 0,
                'y': 0
              },
              'group': 'edges',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': 'bezier'
            }, {
              'data': {
                'lineColor': '#999',
                'source': 'k',
                'target': 'j',
                'id': 'b156d2a8-47f3-45c3-ad73-957ed7554adf'
              },
              'position': {
                'x': 0,
                'y': 0
              },
              'group': 'edges',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': 'bezier'
            }, {
              'data': {
                'lineColor': '#999',
                'source': 'k',
                'target': 'e',
                'id': '1924d8f6-58b3-43a7-a9da-dfa085c7d532'
              },
              'position': {
                'x': 0,
                'y': 0
              },
              'group': 'edges',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': 'bezier'
            }, {
              'data': {
                'lineColor': '#999',
                'source': 'k',
                'target': 'g',
                'id': 'ae7a7d53-c0e7-48cb-8fe0-939fafae5d77'
              },
              'position': {
                'x': 0,
                'y': 0
              },
              'group': 'edges',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': 'bezier'
            }, {
              'data': {
                'lineColor': '#999',
                'source': 'g',
                'target': 'j',
                'id': 'd78d66ca-9482-474d-9351-225f3f6dd3ac'
              },
              'position': {
                'x': 0,
                'y': 0
              },
              'group': 'edges',
              'removed': false,
              'selected': false,
              'selectable': true,
              'locked': false,
              'grabbable': true,
              'classes': 'bezier'
            }]
          },
          'pan': {
            'x': 0,
            'y': 0
          },
          'panningEnabled': true,
          'userPanningEnabled': true,
          'userZoomingEnabled': true,
          'zoom': 1,
          'zoomingEnabled': true
        }
      }, 5000)
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

</style>
