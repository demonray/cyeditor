<template>
  <div id="cy-editor-el" />
</template>
<script lang="ts">
import { VNode } from 'vue'
import CyEditor from '../src/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { CyEditorOptions } from '../src/defaults/editor-config'


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

interface AnyObj {
  [propname: string]: any
}

@Component({
  name: 'CyEditor'
})
export default class extends Vue {
  @Prop({ default: defaultValue }) private value?: AnyObj
  @Prop({ default: {} }) private cyConfig?: AnyObj
  @Prop({ default: {} }) private editorConfig?: AnyObj

  mounted() {
    const config: CyEditorOptions = {
      cy: {
        ...this.cyConfig
      },
      editor: {
        container: '#cy-editor-el',
        ...this.editorConfig
      }
    }
    this.editorInst = new CyEditor(config)
    const value = Object.assign({}, defaultValue, this.value)
    this.editorInst.json(value)
    this.editorInst.on('change', (scope, editor) => {
      const json = cyEditor.json()
      console.log(scope, editor, json)
    })
  }

  render(createElement): VNode {
    return createElement('div')
  }
}
</script>
