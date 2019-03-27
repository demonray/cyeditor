/**
 * Created by DemonRay on 2019/3/24.
 */
import { defaultNodeTypes, defaultNodeStyles, getNodeConf} from './node-types'
import { defaultEdgeTypes,defaultEdgeStyles, getEdgeConf} from './edge-types'


const defaultConfData = {
    node: {
        type: 'rectangle',
        bg: '#999',
        resize: true,
        name: '',
        width: 80,
        height: 80,
    },
    edge: {
        lineColor: '#999'
    }
}

export {
    defaultConfData,
    defaultNodeTypes,
    defaultNodeStyles,
    getNodeConf,
    defaultEdgeTypes,
    defaultEdgeStyles,
    getEdgeConf
}
