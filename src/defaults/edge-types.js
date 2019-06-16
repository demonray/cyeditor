/**
 * Created by DemonRay on 2019/3/27.
 */

const defaultEdgeTypes = {}

const defaultEdgeStyles = [
  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'width': 2
    }
  },
  {
    'selector': 'edge.taxi',
    'style': {
      'curve-style': 'taxi',
      'taxi-direction': 'downward',
      'taxi-turn': 20,
      'taxi-turn-min-distance': 5
    }
  },
  {
    'selector': 'edge.bezier',
    'style': {
      'curve-style': 'bezier',
      'control-point-step-size': 40
    }
  },
  {
    'selector': 'edge.straight',
    'style': {
      'curve-style': 'straight'
    }
  },
  {
    selector: 'edge[lineColor]',
    style: {
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'width': 2,
      'line-color': 'data(lineColor)',
      'source-arrow-color': 'data(lineColor)',
      'target-arrow-color': 'data(lineColor)',
      'mid-source-arrow-color': 'data(lineColor)',
      'mid-target-arrow-color': 'data(lineColor)'
    }
  },
  {
    selector: 'edge:active',
    style: {
      'overlay-color': '#0169D9',
      'overlay-padding': 3,
      'overlay-opacity': 0.25,
      'line-color': 'data(lineColor)',
      'source-arrow-color': 'data(lineColor)',
      'target-arrow-color': 'data(lineColor)',
      'mid-source-arrow-color': 'data(lineColor)',
      'mid-target-arrow-color': 'data(lineColor)'
    }
  },
  {
    selector: 'edge:selected',
    style: {
      'overlay-color': '#0169D9',
      'overlay-padding': 3,
      'overlay-opacity': 0.25,
      'line-color': 'data(lineColor)',
      'source-arrow-color': 'data(lineColor)',
      'target-arrow-color': 'data(lineColor)',
      'mid-source-arrow-color': 'data(lineColor)',
      'mid-target-arrow-color': 'data(lineColor)'
    }
  }
]

function getEdgeConf (type) {
  return defaultEdgeTypes.find(item => item.type === type)
}

export { defaultEdgeTypes, defaultEdgeStyles, getEdgeConf }
