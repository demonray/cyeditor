/**
 * Created by DemonRay on 2019/3/24.
 */

import roundRectangle from './node-svgs/round-rectangle.svg'
import ellipse from './node-svgs/ellipse.svg'
import hexagon from './node-svgs/hexagon.svg'
import star from './node-svgs/star.svg'
import pentagon from './node-svgs/pentagon.svg'
import diamond from './node-svgs/diamond.svg'
import tag from './node-svgs/tag.svg'
import polygon from './node-svgs/polygon.svg'

const defaultNodeTypes = [
  {
    type: 'ellipse',
    src: ellipse,
    bg: '#FFC069',
    resize: true,
    width: 76,
    height: 76,
    category: '基础形状'
  },
  {
    type: 'round-rectangle',
    src: roundRectangle,
    bg: '#1890FF',
    resize: true,
    width: 76,
    height: 56,
    category: '基础形状'
  },
  {
    type: 'diamond',
    src: diamond,
    bg: '#5CDBD3',
    resize: true,
    width: 76,
    height: 76,
    category: '基础形状'
  },
  {
    type: 'pentagon',
    src: pentagon,
    bg: '#722ed1',
    resize: true,
    width: 76,
    height: 76,
    category: '基础形状'
  },
  {
    type: 'tag',
    src: tag,
    bg: '#efbae4',
    resize: true,
    width: 70,
    height: 76,
    category: '基础形状'
  },
  {
    type: 'star',
    src: star,
    bg: '#00e217',
    resize: true,
    width: 76,
    height: 76,
    category: '基础形状'
  },
  {
    type: 'hexagon',
    src: hexagon,
    bg: '#ea9f00',
    resize: true,
    width: 76,
    height: 70,
    category: '基础形状'
  },
  {
    'type': 'polygon',
    'src': polygon,
    bg: '#f7130e',
    resize: true,
    width: 76,
    height: 76,
    'points': [
      -0.33, -1,
      0.33, -1,
      0.33, -0.33,
      1, -0.33,
      1, 0.33,
      0.33, 0.33,
      0.33, 1,
      -0.33, 1,
      -0.33, 0.33,
      -1, 0.33,
      -1, -0.33,
      -0.33, -0.33
    ],
    category: '基础形状'
  }
]
const defaultNodeStyles = [{
  'selector': 'node[type]',
  'style': {
    'shape': 'data(type)',
    'label': 'data(type)',
    'height': 'data(height)',
    'width': 'data(width)',
    'text-valign': 'center',
    'text-halign': 'center'
  }
}, {
  'selector': 'node[points]',
  'style': {
    'shape-polygon-points': 'data(points)',
    'label': 'polygon\n(custom points)',
    'text-wrap': 'wrap'
  }
}, {
  'selector': 'node[name]',
  'style': {
    'content': 'data(name)'
  }
}, {
  'selector': 'node[image]',
  'style': {
    'background-opacity': 0,
    'background-image': (e) => { return e.data('image') || { value: '' } }
  }
}, {
  'selector': 'node[bg]',
  'style': {
    'background-opacity': 0.45,
    'background-color': 'data(bg)',
    'border-width': 1,
    'border-opacity': 0.8,
    'border-color': 'data(bg)'
  }
}, {
  selector: 'node:active',
  style: {
    'overlay-color': '#0169D9',
    'overlay-padding': 12,
    'overlay-opacity': 0.25
  }
}, {
  selector: 'node:selected',
  style: {
    'overlay-color': '#0169D9',
    'overlay-padding': 12,
    'overlay-opacity': 0.25
  }
}]

export {
  defaultNodeTypes,
  defaultNodeStyles
}
