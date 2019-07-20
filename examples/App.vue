<template>
  <cy-editor
      class="cy-editor"
      :value="value"
      :cy-config="cyConfig"
      :editor-config="editorConfig"
      @change="change" />
</template>

<script>
import cyEditor from './cyeditor.js'

export default {
  name: 'App',
  components: {
    cyEditor
  },
  data () {
    return {
      value: {},
      cyConfig: {},
      editorConfig: {}
    }
  },
  mounted () {
    //
  },
  computed: {},
  methods: {
    change () {
      console.log('change')
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
