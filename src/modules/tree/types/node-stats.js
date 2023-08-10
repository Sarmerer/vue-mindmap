export class NodeStats {
  constructor(node) {
    this.node = node
  }

  getChildrenCount(deep = false) {
    if (this.node.childrenCountOverride > 0)
      return this.node.childrenCountOverride

    let count = this.node.children.length

    if (deep) {
      for (const child of this.node.children) {
        count += child.stats.getChildrenCount(true)
      }
    }

    return count
  }

  getCompletedChildrenCount(deep = false) {
    if (this.node.completedChildrenCountOverride > 0)
      return this.node.completedChildrenCountOverride

    let count = 0
    for (const child of this.node.getChildren(deep)) {
      if (child.isCompleted) count++
    }

    return count
  }

  getChildrenWeight(deep = false) {
    if (this.node.childrenCountOverride > 0)
      return this.node.childrenCountOverride

    let weight = 0
    for (const child of this.node.getChildren(deep)) {
      weight += child.weight
    }

    return weight
  }

  getCompletedChildrenWeight(deep = false) {
    if (this.node.completedChildrenCountOverride > 0)
      return this.node.completedChildrenCountOverride

    let weight = 0
    for (const child of this.node.getChildren(deep)) {
      if (child.isCompleted) weight += child.weight
    }

    return weight
  }

  getChildrenProgress(deep = false) {
    const childrenWeight = this.getChildrenWeight(deep)
    const completedChildrenWeight = this.getCompletedChildrenWeight(deep)
    if (childrenWeight === 0) return 0

    return (completedChildrenWeight / childrenWeight) * 100
  }
}
