const DUMMY_PARENT = 1

export class Reorder {
  constructor(tree) {
    this.tree = tree

    this.activeNode = null
    this.oldParent = null
    this.oldIndex = null
    this.wasCollapsed = false
    this.wasActive = false

    this.potentialRelative = null
    this.potentialRelativeSide = null

    this.grabOffsetX = 0
    this.grabOffsetY = 0

    this.listeners = {
      update: this.update.bind(this),
      end: this.end.bind(this),
    }
  }

  get canvas() {
    return this.tree.mindmap.canvas
  }

  maybeStart(node) {
    this.wasActive = node.isActive
    this.wasCollapsed = node.isCollapsed
    node.setActive()

    let initialX = this.canvas.cursorX
    let initialY = this.canvas.cursorY

    const maybeStart_ = () => {
      const dx = Math.abs(this.canvas.cursorX - initialX)
      const dy = Math.abs(this.canvas.cursorY - initialY)
      if (dx < 15 && dy < 15) return

      this.start(node)
    }

    const cancel = () => {
      if (this.wasActive) {
        node.setCollapsed(!node.isCollapsed)
      }

      window.removeEventListener('mousemove', maybeStart_)
    }

    window.addEventListener('mousemove', maybeStart_)
    window.addEventListener('mouseup', cancel, { once: true })
  }

  start(node) {
    if (this.activeNode) return
    if (node.isRoot) return

    this.activeNode = node
    this.oldParent = node.parent
    this.oldIndex = node.parent.children.indexOf(node)

    this.activeNode.isCollapsed = true

    this.tree.setActiveNode(this.activeNode)
    this.activeNode.setParent(null)
    this.activeNode.parent = DUMMY_PARENT

    this.grabOffsetX = this.canvas.cursorX - this.activeNode.x
    this.grabOffsetY = this.canvas.cursorY - this.activeNode.y

    window.addEventListener('mousemove', this.listeners.update)
    window.addEventListener('mouseup', this.listeners.end, { once: true })
  }

  update() {
    if (!this.activeNode) return

    this.activeNode.x = this.canvas.cursorX - this.grabOffsetX
    this.activeNode.y = this.canvas.cursorY - this.grabOffsetY

    const { cursorX, cursorY } = this.canvas

    const closestNode = this.getClosestNode(cursorX, cursorY)
    if (!closestNode) {
      this.setPotentialRelative(null)
      return
    }

    const quadrant = this.getHoveredQuadrant(cursorX, cursorY, closestNode)
    this.setPotentialRelative(closestNode, quadrant)
  }

  end() {
    if (!this.activeNode) return

    this.reorder()

    if (!this.wasCollapsed) {
      this.activeNode.isCollapsed = false
    }

    this.activeNode = null
    this.oldParent = null
    this.wasCollapsed = false

    this.tree.renderer.render()

    window.removeEventListener('mousemove', this.listeners.update)
  }

  reorder() {
    if (!this.activeNode) return

    if (!this.potentialRelative) {
      this.activeNode.parent = this.oldParent
      this.activeNode.parent.children.splice(this.oldIndex, 0, this.activeNode)
      return
    }

    switch (this.potentialRelativeSide) {
      case 'right':
        this.makeChild(this.potentialRelative)
        break
      case 'top':
        this.makeSibling(this.potentialRelative, 0)
        break
      case 'bottom':
        this.makeSibling(this.potentialRelative, 1)
        break
    }

    this.setPotentialRelative(null)
  }

  makeChild(node) {
    this.activeNode.parent = null
    this.activeNode.setParent(node)
  }

  makeSibling(node, offset) {
    if (!node.parent) return

    this.activeNode.parent = node.parent
    const index = node.parent.children.indexOf(node)
    node.parent.children.splice(index + offset, 0, this.activeNode)
  }

  setPotentialRelative(node, side) {
    if (this.potentialRelative) {
      this.potentialRelativeSide = null
    }

    this.potentialRelative = node

    if (this.potentialRelative) {
      this.potentialRelativeSide = side || null
    }
  }

  getClosestNode(x, y) {
    let closestNode = null
    let closestDistance = Infinity
    for (const node of this.tree.nodes) {
      if (node.isRoot || node === this.activeNode) continue
      if (!this.isOverlapping(x, y, node)) continue

      const distance = this.getDistance(x, y, node.x, node.y)
      if (distance > closestDistance) continue

      closestNode = node
      closestDistance = distance
    }

    return closestNode
  }

  isOverlapping(x, y, node) {
    return !(
      x < node.x ||
      x > node.x + node.width ||
      y < node.y ||
      y > node.y + node.height
    )
  }

  getHoveredQuadrant(x, y, otherNode) {
    const centerY = otherNode.y + otherNode.height / 2
    const rightBoundary = otherNode.x + (2 / 3) * otherNode.width

    if (x > rightBoundary) return 'right'
    return y < centerY ? 'top' : 'bottom'
  }

  getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
  }
}
