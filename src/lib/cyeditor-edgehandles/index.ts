import Edgehandles from './edgehandles'
import defaults, { Options } from './edgehandles/defaults'

export default (cy?: any) => {
  if (!cy) { return }

  cy('core', 'edgehandles', function (this: cytoscape.Core, options: Options = defaults) {
    return new Edgehandles(this, options)
  })
}
