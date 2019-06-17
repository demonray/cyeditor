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
    toolbar: true, // boolean or array: ['undo', 'redo', 'copy', 'paste', 'delete', 'zoomin', 'zoomout', 'fit', 'leveldown', 'levelup', 'gridon', 'boxselect', 'line-straight', 'line-taxi', 'line-bezier', 'save']
    snapGrid: true,
    contextMenu: true,
    navigator: true,
    useDefaultNodeTypes: true, // whether nodeTypes should concat with defaultNodeTypes
    nodeTypes: defaultNodeTypes,
    autoSave: true, // Todo
    beforeAdd (el) {
      return true
    },
    afterAdd (el) {

    }
  }
}
