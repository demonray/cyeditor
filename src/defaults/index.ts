/**
 * Created by DemonRay on 2019/3/24.
 */
import pluginStyles from './plugin-style'
import defaultEditorConfig from './editor-config'
import { defaultNodeTypes, defaultNodeStyles } from './node-types'
import { defaultEdgeStyles } from './edge-types'

// default node style, default edge style
const defaultConfData = {
  node: {
    type: 'rectangle',
    bg: '#999',
    resize: true,
    name: '',
    width: 80,
    height: 80,
    image: ''
  },
  edge: {
    lineColor: '#999'
  }
}

export * from './editor-config'

export {
  defaultConfData,
  defaultNodeTypes,
  defaultNodeStyles,
  defaultEdgeStyles,
  pluginStyles,
  defaultEditorConfig
}
