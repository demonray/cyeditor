<script lang="ts">
import CyEditor from '../src/index'
const defaultValue = {
  boxSelectionEnabled: true,
  elements: null ,
  pan: {
    x: 0,
    y: 0
  },
  panningEnabled: true,
  userPanningEnabled: true,
  userZoomingEnabled: true,
  zoom: 1,
  zoomingEnabled: true
}
export default {
  name: 'CyEditor',
  props: {
    value: {
      type: Object,
      default: () => {
        return defaultValue
      }
    },
    cyConfig: {
      type: Object,
      default: () => ({})
    },
    editorConfig: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    const container = this.$el
    const config = {
      cy: {
        ...this.cyConfig
      },
      editor: {
        container,
        ...this.editorConfig
      }
    }
    const cyEditor = new CyEditor(config)
    const value = Object.assign({}, defaultValue, this.value)
    cyEditor.json(value)
    cyEditor.on('change', (scope, editor) => {
      const json = cyEditor.json()
      console.log(scope, editor, json)
    })
  },
  render(createElement) {
    return createElement('div')
  }
}

</script>
