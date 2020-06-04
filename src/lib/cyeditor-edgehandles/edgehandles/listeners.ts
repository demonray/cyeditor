function addListeners(this: any) {
  this.addCytoscapeListeners()
  this.addListener(this.cy, 'destroy', () => this.destroy())
  return this
}

function removeListeners(this: any) {
  for (let i = this.listeners.length - 1; i >= 0; i--) {
    let l = this.listeners[i]
    this.removeListener(l.target, l.event, l.selector, l.callback, l.options)
  }
  return this
}

function getListener(this: any, target: any, event: any, selector: any, callback: any, options: any) {
  if (typeof selector !== typeof '') {
    callback = selector
    options = callback
    selector = null
  }

  if (options == null) {
    options = false
  }

  return { target, event, selector, callback, options }
}

function isDom(target: any) {
  return target instanceof Element
}

function addListener(this: any, target: any, event: any, selector: any, callback: any, options: any) {
  let l = getListener(target, event, selector, callback, options)

  this.listeners.push(l)

  if (isDom(l.target)) {
    l.target.addEventListener(l.event, l.callback, l.options)
  } else {
    if (l.selector) {
      l.target.addListener(l.event, l.selector, l.callback, l.options)
    } else {
      l.target.addListener(l.event, l.callback, l.options)
    }
  }

  return this
}

function removeListener(this: any, target: any, event: any, selector: any, callback: any, options: any) {
  let l = getListener(target, event, selector, callback, options)

  for (let i = this.listeners.length - 1; i >= 0; i--) {
    let l2 = this.listeners[i]

    if (
      l.target === l2.target &&
      l.event === l2.event &&
      (l.selector == null || l.selector === l2.selector) &&
      (l.callback == null || l.callback === l2.callback)
    ) {
      this.listeners.splice(i, 1)

      if (isDom(l.target)) {
        l.target.removeEventListener(l.event, l.callback, l.options)
      } else {
        if (l.selector) {
          l.target.removeListener(l.event, l.selector, l.callback, l.options)
        } else {
          l.target.removeListener(l.event, l.callback, l.options)
        }
      }

      break
    }
  }

  return this
}

function emit(this: any, type: string, position: any, ...args: any[]) {
  let { options, cy } = this

  cy.emit({ type: `eh${type}`, position }, args)

  let handler = options[type]

  if (handler != null) {
    handler(...args)
  }

  return this
}

export default { addListener, addListeners, removeListener, removeListeners, emit }
