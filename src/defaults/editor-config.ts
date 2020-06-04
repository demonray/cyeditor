import { defaultNodeTypes, defaultNodeStyles } from './node-types'
import { defaultEdgeStyles } from './edge-types'
import pluginStyles from './plugin-style'

export type LineTypes  = 'taxi' | 'bezier'
export interface EditorOptions {
  container: string,
  zoomRate: number,
  lineType: LineTypes,
  noderesize: boolean,
  dragAddNodes: boolean,
  elementsInfo: boolean,
  toolbar: boolean, // boolean or array: ['undo', 'redo', 'copy', 'paste', 'delete', 'zoomin', 'zoomout', 'fit', 'leveldown', 'levelup', 'gridon', 'boxselect', 'line-straight', 'line-taxi', 'line-bezier', 'save']
  snapGrid: boolean,
  contextMenu: boolean,
  navigator: boolean,
  useDefaultNodeTypes?: boolean // whether nodeTypes should concat with defaultNodeTypes
  nodeTypes: any,
  autoSave: boolean,
  beforeAdd: (el: Element) => boolean,
  afterAdd: (el: Element) => any
}
export interface CyOptions extends cytoscape.CytoscapeOptions {

}


const cy: CyOptions = {
  layout: {
    name: 'concentric',
    fit: false,
    concentric: function (n) { return 0 }
  },
  styleEnabled: true,
  style: [
    ...defaultEdgeStyles,
    ...defaultNodeStyles,
    ...pluginStyles
  ],
  minZoom: 0.1,
  maxZoom: 10,
  elements: []
}

const editor: EditorOptions = {
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
  beforeAdd(el) {
    return true
  },
  afterAdd(el) {

  }
}

export interface CyEditorOptions {
  cy?: CyOptions,
  editor: EditorOptions
}

const defaultConfig: CyEditorOptions = {
  cy,
  editor
}

export default defaultConfig
