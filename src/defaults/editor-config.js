import { defaultNodeTypes, defaultNodeStyles } from './node-types'
import { defaultEdgeStyles } from './edge-types'
import pluginStyles from './plugin-style'

export default {
  cy: {
    layout: {
      name: 'concentric',
      fit: false,
      concentric: function (n) { return 0 },
      minNodeSpacing: 100
    },
    styleEnabled: true,
    style: [
      ...defaultEdgeStyles,
      ...defaultNodeStyles,
      ...pluginStyles
    ],
    minZoom: 0.1,
    maxZoom: 10
  },
  editor: {
    container: '',
    zoomRate: 0.2,
    lineType: 'bezier',
    noderesize: true,
    dragAddNodes: true,
    elementsInfo: true,
    toolbar: true, // ['undo', 'redo', 'copy', 'paste', 'delete', 'zoomin', 'zoomout', 'fit', 'leveldown', 'levelup', 'gridon', 'boxselect', 'line-straight', 'line-taxi', 'line-bezier', 'save']
    snapGrid: true,
    navigator: true,
    nodeTypesConcat: true,
    nodeTypes: defaultNodeTypes, // [{type,src,category,width:76,height:76}]
    autoSave: true, // Todo
    save (type) { // png jpg json

    },
    fit (status) {
      console.log(status)
    },
    beforeAdd (el) {
      return true
    },
    afterAdd (el) {

    }
  }
}
