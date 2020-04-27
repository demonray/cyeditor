declare namespace cyeditor {
  type LineTypes  = 'taxi' | 'bezier'

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

  // export interface CyEditorCore extends cytoscape.Core {
  //   snapToGrid: () => void
  //   noderesize: (o)=> void
  //   contextMenu: ()=> void
  //   navigator: (o)=> void
  //   undoRedo: ()=> void
  //   clipboard: ()=> void
  //   removeData: (names?: string)=> cytoscape.CollectionReturnValue
  //   removeAllListeners: ()=> void
  //   edgehandles: (options:object)=> void
  //   dragAddNodes: (options:object)=> void
  //   editElements: (options:object)=> void
  //   toolbar: (options:object)=> void
  // }

  export interface CyOptions extends cytoscape.CytoscapeOptions {

  }
}
