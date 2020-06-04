/**
 * Created by DemonRay on 2019/4/1.
 */
// Get scratch pad reserved for this extension on the given element or the core if 'name' parameter is not set,
// if the 'name' parameter is set then return the related property in the scratch instead of the whole scratchpad
function getScratch(eleOrCy: cytoscape.Core, name?: any) {
    if (eleOrCy.scratch('_undoRedo') === undefined) {
        eleOrCy.scratch('_undoRedo', {})
    }

    let scratchPad = eleOrCy.scratch('_undoRedo')

    return (name === undefined) ? scratchPad : scratchPad[name]
}

// Set the a field (described by 'name' parameter) of scratchPad (that is reserved for this extension
// on an element or the core) to the given value (by 'val' parameter)
function setScratch(eleOrCy: cytoscape.Core, name: any, val: any) {
    let scratchPad = getScratch(eleOrCy)
    scratchPad[name] = val
    eleOrCy.scratch('_undoRedo', scratchPad)
}

// Generate an instance of the extension for the given cy instance
function generateInstance(cy: cytoscape.Core) {

    let instance: any = {}

    instance.options = {
        isDebug: false, // Debug mode for console messages
        actions: {}, // actions to be added
        undoableDrag: true, // Whether dragging nodes are undoable can be a function as well
        stackSizeLimit: undefined // Size limit of undo stack, note that the size of redo stack cannot exceed size of undo stack
    }

    instance.actions = {}

    instance.undoStack = []

    instance.redoStack = []

    // resets undo and redo stacks
    instance.reset = function () {
        this.undoStack = []
        this.redoStack = []
    }

    // Undo last action
    instance.undo = function () {
        if (!this.isUndoStackEmpty()) {
            let action = this.undoStack.pop()
            cy.trigger('cyeditor.beforeUndo', [action.name, action.args])

            let res = this.actions[action.name]._undo(action.args)

            this.redoStack.push({
                name: action.name,
                args: res
            })

            cy.trigger('cyeditor.afterUndo', [action.name, action.args, res])
            if (this.options.isDebug) console.log(this.redoStack, this.undoStack)
            return res
        } else if (this.options.isDebug) {
            console.log('Undoing cannot be done because undo stack is empty!')
        }
    }

    // Redo last action
    instance.redo = function () {
        if (!this.isRedoStackEmpty()) {
            let action = this.redoStack.pop()

            cy.trigger(action.firstTime ? 'cyeditor.beforeDo' : 'cyeditor.beforeRedo', [action.name, action.args])

            if (!action.args) { action.args = {} }
            action.args.firstTime = !!action.firstTime

            let res = this.actions[action.name]._do(action.args)

            this.undoStack.push({
                name: action.name,
                args: res
            })

            if (this.options.stackSizeLimit !== undefined && this.undoStack.length > this.options.stackSizeLimit) {
                this.undoStack.shift()
            }

            cy.trigger(action.firstTime ? 'cyeditor.afterDo' : 'cyeditor.afterRedo', [action.name, action.args, res])
            if (this.options.isDebug) console.log(this.redoStack, this.undoStack)
            return res
        } else if (this.options.isDebug) {
            console.log('Redoing cannot be done because redo stack is empty!')
        }
    }

    // Calls registered function with action name actionName via actionFunction(args)
    instance.do = function (actionName: string, args: any) {
        this.redoStack.length = 0
        this.redoStack.push({
            name: actionName,
            args: args,
            firstTime: true
        })

        return this.redo()
    }

    // Undo all actions in undo stack
    instance.undoAll = function () {
        while (!this.isUndoStackEmpty()) {
            this.undo()
        }
    }

    // Redo all actions in redo stack
    instance.redoAll = function () {
        while (!this.isRedoStackEmpty()) {
            this.redo()
        }
    }

    // Register action with its undo function & action name.
    instance.action = function (actionName: string, _do: any, _undo: any) {
        this.actions[actionName] = {
            _do: _do,
            _undo: _undo
        }

        return this
    }

    // Removes action stated with actionName param
    instance.removeAction = function (actionName: string) {
        delete this.actions[actionName]
    }

    // Gets whether undo stack is empty
    instance.isUndoStackEmpty = function () {
        return (this.undoStack.length === 0)
    }

    // Gets whether redo stack is empty
    instance.isRedoStackEmpty = function () {
        return (this.redoStack.length === 0)
    }

    // Gets actions (with their args) in undo stack
    instance.getUndoStack = function () {
        return this.undoStack
    }

    // Gets actions (with their args) in redo stack
    instance.getRedoStack = function () {
        return this.redoStack
    }

    return instance
}

function setDragUndo(cy: cytoscape.Core, undoable: any) {
    let lastMouseDownNodeInfo: any = null

    cy.on('grab', 'node', function (e) {
        let node = e.target
        if (typeof undoable === 'function' ? undoable.call(node) : undoable) {
            lastMouseDownNodeInfo = {}
            lastMouseDownNodeInfo.lastMouseDownPosition = {
                x: node.position('x'),
                y: node.position('y')
            }
            lastMouseDownNodeInfo.node = node
        }
    })
    cy.on('free', 'node', function (e) {
        let instance = getScratch(cy, 'instance')
        let node = e.target
        if (typeof undoable === 'function' ? undoable.call(node) : undoable) {
            if (lastMouseDownNodeInfo === null) {
                return
            }
            let node = lastMouseDownNodeInfo.node
            let lastMouseDownPosition = lastMouseDownNodeInfo.lastMouseDownPosition
            let mouseUpPosition = {
                x: node.position('x'),
                y: node.position('y')
            }
            if (mouseUpPosition.x !== lastMouseDownPosition.x ||
                mouseUpPosition.y !== lastMouseDownPosition.y) {
                let positionDiff = {
                    x: mouseUpPosition.x - lastMouseDownPosition.x,
                    y: mouseUpPosition.y - lastMouseDownPosition.y
                }

                let nodes
                if (node.selected()) {
                    nodes = cy.nodes(':visible').filter(':selected')
                } else {
                    nodes = cy.collection([node])
                }

                let param = {
                    positionDiff: positionDiff,
                    nodes: nodes,
                    move: false
                }

                instance.do('drag', param)

                lastMouseDownNodeInfo = null
            }
        }
    })
}

// Default actions
function defaultActions(cy: cytoscape.Core) {
    function getTopMostNodes(nodes: any) {
        let nodesMap = {}
        for (let i = 0; i < nodes.length; i++) {
            nodesMap[nodes[i].id()] = true
        }
        let roots = nodes.filter(function (ele: any, i: number) {
            if (typeof ele === 'number') {
                ele = i
            }
            let parent = ele.parent()[0]
            while (parent !== null && parent) {
                if (parent && nodesMap[parent.id()]) {
                    return false
                }
                parent = parent.parent()[0]
            }
            return true
        })

        return roots
    }

    function moveNodes(positionDiff: any, nodes: any, notCalcTopMostNodes?: any) {
        let topMostNodes = notCalcTopMostNodes ? nodes : getTopMostNodes(nodes)
        for (let i = 0; i < topMostNodes.length; i++) {
            let node = topMostNodes[i]
            let oldX = node.position('x')
            let oldY = node.position('y')
            // Only simple nodes are moved since the movement of compounds caused the position to be moved twice
            if (!node.isParent()) {
                node.position({
                    x: oldX + positionDiff.x,
                    y: oldY + positionDiff.y
                })
            }
            let children = node.children()
            moveNodes(positionDiff, children, true)
        }
    }

    function getEles(_eles: any) {
        return (typeof _eles === 'string') ? cy.$(_eles) : _eles
    }

    function restoreEles(_eles: any) {
        return getEles(_eles).restore()
    }

    function returnToPositions(positions: any) {
        let currentPositions = {}
        cy.nodes().positions(function (ele: any, i) {
            if (typeof ele === 'number') {
                ele = i
            }

            currentPositions[ele.id()] = {
                x: ele.position('x'),
                y: ele.position('y')
            }
            let pos = positions[ele.id()]
            return {
                x: pos.x,
                y: pos.y
            }
        })

        return currentPositions
    }

    function getNodePositions() {
        let positions = {}
        let nodes = cy.nodes()
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i]
            positions[node.id()] = {
                x: node.position('x'),
                y: node.position('y')
            }
        }
        return positions
    }

    function changeParent(param: any) {
        let result: any = {
        }
        // If this is first time we should move the node to its new parent and relocate it by given posDiff params
        // else we should remove the moved eles and restore the eles to restore
        if (param.firstTime) {
            let newParentId = param.parentData === undefined ? null : param.parentData
            // These eles includes the nodes and their connected edges and will be removed in nodes.move().
            // They should be restored in undo
            let withDescendant = param.nodes.union(param.nodes.descendants())
            result.elesToRestore = withDescendant.union(withDescendant.connectedEdges())
            // These are the eles created by nodes.move(), they should be removed in undo.
            result.movedEles = param.nodes.move({ 'parent': newParentId })

            let posDiff = {
                x: param.posDiffX,
                y: param.posDiffY
            }

            moveNodes(posDiff, result.movedEles)
        } else {
            result.elesToRestore = param.movedEles.remove()
            result.movedEles = param.elesToRestore.restore()
        }

        if (param.callback) {
            result.callback = param.callback // keep the provided callback so it can be reused after undo/redo
            param.callback(result.movedEles) // apply the callback on newly created elements
        }

        return result
    }

    // function registered in the defaultActions below
    // to be used like .do('batch', actionList)
    // allows to apply any quantity of registered action in one go
    // the whole batch can be undone/redone with one key press
    function batch(actionList: any, doOrUndo: any) {
        let tempStack = [] // corresponds to the results of every action queued in actionList
        let instance = getScratch(cy, 'instance') // get extension instance through cy
        let actions = instance.actions

        // here we need to check in advance if all the actions provided really correspond to available functions
        // if one of the action cannot be executed, the whole batch is corrupted because we can't go back after
        for (let i = 0; i < actionList.length; i++) {
            let action = actionList[i]
            if (!actions.hasOwnProperty(action.name)) {
                console.error('Action ' + action.name + ' does not exist as an undoable function')
            }
        }

        for (let i = 0; i < actionList.length; i++) {
            let action = actionList[i]
            // firstTime property is automatically injected into actionList by the do() function
            // we use that to pass it down to the actions in the batch
            action.param.firstTime = actionList.firstTime
            let actionResult
            if (doOrUndo === 'undo') {
                actionResult = actions[action.name]._undo(action.param)
            } else {
                actionResult = actions[action.name]._do(action.param)
            }

            tempStack.unshift({
                name: action.name,
                param: actionResult
            })
        }

        return tempStack
    };

    return {
        'add': {
            _do: function (eles:any) {
                return eles.firstTime ? cy.add(eles) : restoreEles(eles)
            },
            _undo: cy.remove
        },
        'remove': {
            _do: cy.remove,
            _undo: restoreEles
        },
        'restore': {
            _do: restoreEles,
            _undo: cy.remove
        },
        'select': {
            _do: function (_eles: any) {
                return getEles(_eles).select()
            },
            _undo: function (_eles: any) {
                return getEles(_eles).unselect()
            }
        },
        'unselect': {
            _do: function (_eles:any) {
                return getEles(_eles).unselect()
            },
            _undo: function (_eles:any) {
                return getEles(_eles).select()
            }
        },
        'move': {
            _do: function (args:any) {
                let eles = getEles(args.eles)
                let nodes = eles.nodes()
                let edges = eles.edges()

                return {
                    oldNodes: nodes,
                    newNodes: nodes.move(args.location),
                    oldEdges: edges,
                    newEdges: edges.move(args.location)
                }
            },
            _undo: function (eles:any) {
                let newEles = cy.collection()
                let location: any = {}
                if (eles.newNodes.length > 0) {
                    location.parent = eles.newNodes[0].parent()

                    for (let i = 0; i < eles.newNodes.length; i++) {
                        let newNode = eles.newNodes[i].move({
                            parent: eles.oldNodes[i].parent()
                        })
                        newEles.union(newNode)
                    }
                } else {
                    location.source = location.newEdges[0].source()
                    location.target = location.newEdges[0].target()

                    for (let i = 0; i < eles.newEdges.length; i++) {
                        let newEdge = eles.newEdges[i].move({
                            source: eles.oldEdges[i].source(),
                            target: eles.oldEdges[i].target()
                        })
                        newEles.union(newEdge)
                    }
                }
                return {
                    eles: newEles,
                    location: location
                }
            }
        },
        'drag': {
            _do: function (args: { move: any; positionDiff: any; nodes: any }) {
                if (args.move) { moveNodes(args.positionDiff, args.nodes) }
                return args
            },
            _undo: function (args: { positionDiff: { x: number; y: number }; nodes: any }) {
                let diff = {
                    x: -1 * args.positionDiff.x,
                    y: -1 * args.positionDiff.y
                }
                let result = {
                    positionDiff: args.positionDiff,
                    nodes: args.nodes,
                    move: true
                }
                moveNodes(diff, args.nodes)
                return result
            }
        },
        'layout': {
            _do: function (args:any) {
                if (args.firstTime) {
                    let positions = getNodePositions()
                    let layout
                    if (args.eles) {
                        layout = getEles(args.eles).layout(args.options)
                    } else {
                        layout = cy.layout(args.options)
                    }

                    // Do this check for cytoscape.js backward compatibility
                    if (layout && layout.run) {
                        layout.run()
                    }

                    return positions
                } else { return returnToPositions(args) }
            },
            _undo: function (nodesData:any) {
                return returnToPositions(nodesData)
            }
        },
        'changeParent': {
            _do: function (args:any) {
                return changeParent(args)
            },
            _undo: function (args:any) {
                return changeParent(args)
            }
        },
        'batch': {
            _do: function (args:any) {
                return batch(args, 'do')
            },
            _undo: function (args:any) {
                return batch(args, 'undo')
            }
        }
    }
}

export default (cy?: any) => {
    if (!cy) { return }

    cy('core', 'undoRedo', function (this: cytoscape.Core, options?: any) {
        let instance = getScratch(this, 'instance') || generateInstance(this)
        setScratch(this, 'instance', instance)

        if (options) {
            for (let key in options) {
                if (instance.options.hasOwnProperty(key)) { instance.options[key] = options[key] }
            }

            if (options.actions) {
                for (let key in options.actions) { instance.actions[key] = options.actions[key] }
            }
        }

        if (!getScratch(this, 'isInitialized')) {
            let defActions = defaultActions(this)
            for (let key in defActions) { instance.actions[key] = defActions[key] }

            setDragUndo(this, instance.options.undoableDrag)
            setScratch(this, 'isInitialized', true)
        }

        return instance
    })
}
