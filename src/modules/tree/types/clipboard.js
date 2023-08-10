import { Node } from './node'
import { uuidv4 } from '../../../utils'

/**
 * @param {'copy' | 'cut'} type
 * @param {Node} node
 */
class Buffer {
  constructor(type, node) {
    this.type = type
    this.node = node
  }

  get() {
    return this.node
  }
}

export class Clipboard {
  constructor(tree) {
    this.tree = tree

    this.buffer = null
  }

  copy(node) {
    if (!node) return

    this.buffer = new Buffer(
      'copy',
      node.clone(true, (clone) => {
        clone.id = uuidv4()
      })
    )
  }

  cut(node) {
    if (!node) return

    const children = [node, ...node.getChildren(true)]
    for (const child of children) {
      this.tree.removeNode(child)
    }

    node.setParent(null)
    this.buffer = new Buffer('cut', node)
  }

  paste(node) {
    if (!node || !this.buffer) return

    const buffer = this.buffer.get()

    const children = [buffer, ...buffer.getChildren(true)]
    for (const child of children) {
      this.tree.addNode(child)
    }

    buffer.setParent(node)
    this.buffer = null
  }
}
