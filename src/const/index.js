/**
 * Created by DemonRay on 2019/3/24.
 */
import { defaultNodeTypes, defaultNodeStyles, getNodeConf } from './node-types'
import { defaultEdgeTypes, defaultEdgeStyles, getEdgeConf } from './edge-types'

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

const pluginStyles = [
  {
    selector: '.eh-handle',
    style: {
      'background-color': 'red',
      'width': 12,
      'height': 12,
      'shape': 'ellipse',
      'overlay-opacity': 0,
      'border-width': 12, // makes the handle easier to hit
      'border-opacity': 0,
      'background-opacity': 0.5
    }
  },
  {
    selector: '.eh-hover',
    style: {
      'background-color': 'red',
      'background-opacity': 0.5
    }
  },
  {
    selector: '.eh-source',
    style: {
      'border-width': 2,
      'border-color': 'red'
    }
  },
  {
    selector: '.eh-target',
    style: {
      'border-width': 2,
      'border-color': 'red'
    }
  },
  {
    selector: '.eh-preview, .eh-ghost-edge',
    style: {
      'background-color': 'red',
      'line-color': 'red',
      'target-arrow-color': 'red',
      'source-arrow-color': 'red'
    }
  },
  {
    selector: '.eh-ghost-edge.eh-preview-active',
    style: {
      'opacity': 0
    }
  }
]

export {
  defaultConfData,
  defaultNodeTypes,
  defaultNodeStyles,
  getNodeConf,
  defaultEdgeTypes,
  defaultEdgeStyles,
  getEdgeConf,
  pluginStyles
}
