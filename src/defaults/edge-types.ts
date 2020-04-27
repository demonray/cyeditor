/**
 * Created by DemonRay on 2019/3/27.
 */
const defaultEdgeStyles: cytoscape.Stylesheet[] = [
  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'width': 2
    }
  },
  {
    'selector': 'edge[lineType]',
    'style': {
      'curve-style': 'data(lineType)'
    }
  },
  {
    selector: 'edge[lineColor]',
    style: {
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
    selector: 'edge[lineColor]:active',
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
    selector: 'edge[lineColor]:selected',
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

export {  defaultEdgeStyles }
