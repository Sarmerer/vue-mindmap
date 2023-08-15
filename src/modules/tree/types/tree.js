import { Navigator } from './navigator'
import { Reorder } from './reorder'
import { Renderer } from './renderer'
import { Node } from './node'

import { uuidv4 } from '../../../utils'
import { Clipboard } from './clipboard'

export class Tree {
  constructor(mindmap) {
    this.mindmap = mindmap

    this.id = uuidv4()
    this.label = 'Untitled'

    this.rootsStack = []
    this.nodes = []
    this.links = []

    this.navigator = new Navigator(this)
    this.reorder = new Reorder(this)
    this.clipboard = new Clipboard(this)
    this.renderer = new Renderer(this)
  }

  get repo() {
    return this.mindmap.repo.tree
  }

  get actions() {
    return this.mindmap.actions
  }

  get activeNode() {
    if (!(this.mindmap.activeElement instanceof Node)) return null

    return this.mindmap.activeElement
  }

  getRoot() {
    if (this.rootsStack.length) return this.rootsStack.at(-1)

    return this.nodes.find((node) => node.isRoot)
  }

  getNodes() {
    const root = this.getRoot()
    if (!root) return []

    const nodes = [root, ...root.getVisibleChildren(true)]

    const reorderingNode = this.reorder.activeNode
    if (reorderingNode) {
      nodes.push(reorderingNode)
    }

    return nodes
  }

  addNode(node) {
    this.nodes.push(node)
    this.renderer.render()
  }

  setActiveNode(node) {
    this.mindmap.setActiveElement(node)
  }

  removeNode(node) {
    const index = this.nodes.indexOf(node)
    if (index === -1) return

    this.nodes.splice(index, 1)
    this.renderer.render()
  }

  pushStack(node) {
    this.rootsStack.push(node)
    this.renderer.render()
  }

  popStack() {
    this.rootsStack.pop()
    this.renderer.render()
  }

  serialize() {
    return {
      id: this.id,
      label: this.label,
      nodes: this.nodes.map((node) => node.serialize()),
      activeNode: this.activeNode?.id ?? null,
    }
  }

  deserialize(data) {
    if (!data) return this

    this.id = data.id
    this.label = data.label

    this.nodes = this.#deserializeNodes(data.nodes)

    const activeNode = this.nodes.find((node) => node.id === data.activeNode)
    if (activeNode) {
      this.setActiveNode(activeNode)
    }

    return this
  }

  #deserializeNodes(dataNodes) {
    if (!Array.isArray(dataNodes)) return []

    let root = null
    const dirtyIndex = new Map()
    const cleanIndex = new Map()

    for (const dataNode of dataNodes) {
      const node = new Node(this).deserialize(dataNode)
      dirtyIndex.set(node.id, node)
    }

    for (const dataNode of dataNodes) {
      const node = dirtyIndex.get(dataNode.id)
      if (!node) continue
      if (!dataNode.parent && root !== null) continue

      if (!dataNode.parent) {
        cleanIndex.set(node.id, node)
        root = node
        continue
      }

      const parent = dirtyIndex.get(dataNode.parent)
      if (!parent) continue

      node.parent = parent
      parent.children.push(node)
      cleanIndex.set(node.id, node)
    }

    for (const dataNode of dataNodes) {
      const node = cleanIndex.get(dataNode.id)
      if (!node || !node.children.length) continue

      node.children.sort((a, b) => a.order - b.order)
    }

    return Array.from(cleanIndex.values())
  }
}
