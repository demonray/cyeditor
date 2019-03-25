/**
 * Created by DemonRay on 2019/3/24.
 */

// import rectangle from './node-svgs/rectangle.svg'
// import ellipse  from './node-svgs/ellipse.svg'
// import triangle  from './node-svgs/triangle.svg'
import roundRectangle  from './node-svgs/round-rectangle.svg'
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

const nodeTypes = [
    // {type: 'rectangle', src: rectangle},
    // {type: 'ellipse', src: ellipse},
    // {type: 'triangle', src: triangle},
    {type: 'round-rectangle', src: roundRectangle},
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

const nodeStyles = [ {
    'selector': 'node',
    'style': {
        'shape': 'data(type)',
        'label': 'data(type)',
        'height': 40,
        'width': 40
    }
}, {
    'selector': 'node[points]',
    'style': {
        'shape-polygon-points': 'data(points)',
        'label': 'data(type)',
        'text-wrap': 'wrap'
    }
} ]

function getNodeConf(type) {
    return nodeTypes.find(item=>item.type === type)
}

export { nodeTypes, nodeStyles , getNodeConf}
