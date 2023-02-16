<template>
  <cy-editor
    class="cy-editor"
    :value="value"
    :cy-config="cyConfig"
    :editor-config="editorConfig"
    @change="change"
  />
</template>

<script>
import cyEditor from './cyeditor.js'

const locale = 'en'
const localizationData = {
  en: {
    'start': 'Start',
    'decision': 'Decision'
  },
  cn: {
    'start': '开始',
    'decision': '条件'
  }
}

function localized (key) {
  return localizationData[locale][key]
}

export default {
  name: 'App',
  components: {
    cyEditor
  },
  data () {
    return {
      value: {
        zoom: 0.7,
        pan: { x: 100, y: 40 },
        elements: {
          nodes: [{
            'data': {
              'type': 'round-rectangle',
              'name': localized('start'),
              'resize': true,
              'bg': '#1890FF',
              'width': 76,
              'height': 56,
              'id': 'a79249d9-4d5b-43e1-b268-d389df7ed592'
            },
            'position': {
              'x': 192.5,
              'y': 52.5
            }
          }, {
            'data': {
              'type': 'round-rectangle',
              'name': '',
              'resize': true,
              'bg': '#1890FF',
              'width': 76,
              'height': 56,
              'id': '27e14443-0b39-446f-94e2-3e521a1706f9'
            },
            'position': {
              'x': 87.5,
              'y': 262.5
            }
          }, {
            'data': {
              'type': 'diamond',
              'name': localized('decision'),
              'resize': true,
              'bg': '#5CDBD3',
              'width': 156,
              'height': 52,
              'id': '4072b83e-b702-4168-b548-56bcc52eebd9'
            },
            'position': {
              'x': 192.5,
              'y': 157.5
            }
          }, {
            'data': {
              'type': 'round-rectangle',
              'name': '',
              'resize': true,
              'bg': '#1890FF',
              'width': 76,
              'height': 56,
              'id': '6be4a6b0-49e2-4b2c-b3bd-135684da938a'
            },
            'position': {
              'x': 297.5,
              'y': 262.5
            }
          }],
          edges: [{
            'data': {
              'source': 'a79249d9-4d5b-43e1-b268-d389df7ed592',
              'target': '4072b83e-b702-4168-b548-56bcc52eebd9',
              'lineType': 'taxi',
              'id': '3e6d9858-adbe-4b73-828d-d0732ac29279'
            },
            'position': {
              'x': 17.5,
              'y': 17.5
            }
          }, {
            'data': {
              'source': '4072b83e-b702-4168-b548-56bcc52eebd9',
              'target': '27e14443-0b39-446f-94e2-3e521a1706f9',
              'lineType': 'taxi',
              'id': 'b63708fe-3b53-469a-b908-4c9608112164'
            },
            'position': {
              'x': 17.5,
              'y': 17.5
            }
          }, {
            'data': {
              'source': '4072b83e-b702-4168-b548-56bcc52eebd9',
              'target': '6be4a6b0-49e2-4b2c-b3bd-135684da938a',
              'lineType': 'taxi',
              'id': '0c4d0dc9-a2ee-4ea5-b422-4730913a7ab1'
            },
            'position': {
              'x': 17.5,
              'y': 17.5
            }
          }]
        }
      },
      cyConfig: {},
      editorConfig: {
        lineType: 'taxi'
      }
    }
  },
  mounted () {
    //
  },
  computed: {},
  methods: {
    change () {
      //
    }
  }
}

</script>
<style scoped lang="stylus">
  .cy-editor {
    width: 100%;
    height: 600px;
    position: relative;
  }
</style>
