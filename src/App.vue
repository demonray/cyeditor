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
    initEditor () {
      this.cyEditor = new CyEditor({
        cy: {
          elements: {
            nodes: [
              { data: { id: 'j', name: 'Jerry', resize: true, bg: '#90235d', image: 'https://live.staticflickr.com/2660/3715569167_7e978e8319_b.jpg' } },
              { data: { id: 'e', name: 'Elaine', resize: true, bg: '#f0545d' } },
              { data: { id: 'k', name: 'Kramer', resize: true, bg: '#9954fd' } },
              { data: { id: 'g', name: 'George', type: 'vee', bg: '#00888d' } }
            ],
            edges: [
              { data: { source: 'j', target: 'e', lineColor: '#999' } },
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
        },
        editor: {
          nodeTypes: [{ type: 'ellipse', src: 'https://live.staticflickr.com/2660/3715569167_7e978e8319_b.jpg', resize: true }]
        }
      })
    },
    fit () {
      this.cyEditor.fit()
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
