<template>
    <div id="page">

    </div>
</template>

<script>
import CyEditor from './lib'

export default {
  name: 'App',
  components: {},
  data () {
    return {
        showGrid: true
    }
  },
  mounted () {
    this.initEditor()
  },
  computed: {},
  methods: {
    initEditor() {
        this.cyEditor = new CyEditor(); // todo params
    },
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
