import CyEditor from '../src/index.ts'
export default {
  name: 'CyEditor',
  props: {
    value: {
      type: Object,
      default: () => ({
        boxSelectionEnabled: true,
        elements: null,
        pan: { x: 0, y: 0 },
        panningEnabled: true,
        userPanningEnabled: true,
        userZoomingEnabled: true,
        zoom: 1,
        zoomingEnabled: true
      })
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
  mounted () {
    const container = this.$el
    let config = {
      cy: {
        ...this.cyConfig
      },
      editor: {
        container,
        ...this.editorConfig
      }
    }
    this.cyEditor = new CyEditor(config)
    this.cyEditor.json(this.value)
    this.cyEditor.on('change', (scope, editor) => {
      // let json = this.cyEditor.json()
    })
  },
  render (h) {
    return h('div')
  }
}
