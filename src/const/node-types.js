/**
 * Created by DemonRay on 2019/3/24.
 */

// import rectangle from './node-svgs/rectangle.svg'
import ellipse from './node-svgs/ellipse.svg'
// import triangle  from './node-svgs/triangle.svg'
import roundRectangle from './node-svgs/round-rectangle.svg'
// import bottomRoundRectangle  from './node-svgs/bottom-round-rectangle.svg'
// import cutRectangle  from './node-svgs/cut-rectangle.svg'
// import barrel  from './node-svgs/barrel.svg'
// import rhomboid  from './node-svgs/rhomboid.svg'
// import diamond  from './node-svgs/diamond.svg'
// import pentagon  from './node-svgs/pentagon.svg'
// import hexagon  from './node-svgs/hexagon.svg'
// import concaveHexagon  from './node-svgs/concave-hexagon.svg'
// import heptagon  from './node-svgs/heptagon.svg'
// import octagon  from './node-svgs/octagon.svg'
// import star  from './node-svgs/star.svg'
// import tag  from './node-svgs/tag.svg'
// import vee  from './node-svgs/vee.svg'
// import polygon  from './node-svgs/polygon.svg'

const defaultNodeTypes = [
  // {type: 'rectangle', src: rectangle},
  { type: 'ellipse', src: ellipse, bg: '#1890FF', resize: true, width: 76, height: 76 },
  // {type: 'triangle', src: triangle},
  { type: 'round-rectangle', src: roundRectangle, bg: '#1890FF', resize: true, width: 76, height: 56 }
  // {type: 'bottom-round-rectangle', src: bottomRoundRectangle},
  // {type: 'cut-rectangle', src: cutRectangle},
  // {type: 'barrel', src: barrel},
  // {type: 'rhomboid', src: rhomboid},
  // {type: 'diamond', src: diamond},
  // {type: 'pentagon', src: pentagon},
  // {type: 'hexagon', src: hexagon},
  // {type: 'concave-hexagon', src: concaveHexagon},
  // {type: 'heptagon', src: heptagon},
  // {type: 'octagon', src: octagon},
  // {type: 'star', src: star},
  // {type: 'tag', src: tag},
  // {type: 'vee', src: vee},
  // {
  //     'type': 'polygon',
  //     'src': polygon,
  //     'points': [
  //         -0.33, -1,
  //         0.33, -1,
  //         0.33, -0.33,
  //         1, -0.33,
  //         1, 0.33,
  //         0.33, 0.33,
  //         0.33, 1,
  //         -0.33, 1,
  //         -0.33, 0.33,
  //         -1, 0.33,
  //         -1, -0.33,
  //         -0.33, -0.33
  //     ]
  // }
]

const defaultNodeStyles = [
  {
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
    'selector': 'node[bg]',
    'style': {
      'background-opacity': 0.46,
      'background-color': 'data(bg)',
      'border-width': 2,
      'border-opacity': 0.8,
      'border-color': 'data(bg)'
    }
  }
]

function getNodeConf (type) {
  return defaultNodeTypes.find(item => item.type === type)
}

export { defaultNodeTypes, defaultNodeStyles, getNodeConf }
