import { NodeStats } from "./node-stats";
import { uuidv4 } from "../utils";

export class Node {
  constructor(tree) {
    this.tree = tree;

    this.id = uuidv4();
    this.parent = null;
    this.children = [];

    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;

    this.label = "Awesome task";
    this.highlightedSide = null;
    this.weight = 1;
    this.childrenCountOverride = 0;
    this.completedChildrenCountOverride = 0;
    this.stats = new NodeStats(this);

    this.isEditing = false;
    this.isCollapsed = false;
    this.isCompleted = false;
  }

  get isRoot() {
    return this.parent === null || this.tree.rootsStack.at(-1) === this;
  }

  get isActive() {
    return this.tree.activeNode === this;
  }

  get isReordering() {
    return this.tree.reorder.activeNode === this;
  }

  get isActionable() {
    return !this.isEditing && !this.isReordering;
  }

  get isChildrenCountOverridden() {
    return this.childrenCountOverride > 0;
  }

  get isCompletedDeep() {
    if (!this.isCompleted) return false;

    for (const child of this.getChildren(true)) {
      if (!child.isCompleted) return false;
    }

    return true;
  }

  setEditing(isEditing) {
    this.isEditing = isEditing;
    this.tree.renderer.render();
  }

  setCollapsed(isCollapsed) {
    this.isCollapsed = isCollapsed;
    this.tree.renderer.render();
  }

  setCompleted(isCompleted, deep = false) {
    this.isCompleted = isCompleted;

    if (deep) {
      for (const child of this.children) {
        child.setCompleted(isCompleted, true);
      }
    }
  }

  addSibling() {
    const node = new Node(this.tree);

    if (this.parent) {
      node.setParent(this.parent);
    }

    this.tree.addNode(node);
    return node;
  }

  addChild() {
    this.isCollapsed = false;
    this.isEditing = false;

    const node = new Node(this.tree);
    node.setParent(this);
    this.tree.addNode(node);
    return node;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index === -1) return;

    this.children.splice(index, 1);
  }

  setParent(parent) {
    if (parent && parent.children.indexOf(this) === -1) {
      parent.children.push(this);
    } else if (!parent && this.parent) {
      this.parent.removeChild(this);
    }

    this.parent = parent;
    this.tree.renderer.render();
  }

  setLabel(label) {
    this.label = label;
    this.tree.renderer.render();
  }

  setActive() {
    this.tree.setActiveNode(this);
  }

  getChildren(deep = false) {
    if (this.isCollapsed) return [];

    if (deep) {
      const children = [];
      for (const child of this.children) {
        children.push(child);
        children.push(...child.getChildren(true));
      }

      return children;
    }

    return this.children;
  }

  measure() {
    const el = document.getElementById(this.id);
    if (!el) return;

    this.width = el.offsetWidth;
    this.height = el.offsetHeight;
  }

  /**
   * @param {'top' | 'bottom' | 'right'} side
   */
  highlight(side) {
    this.highlightedSide = side;
  }

  serialize() {
    return {
      id: this.id,
      parent: this.parent?.id ?? null,

      label: this.label,
      weight: this.weight,

      isCollapsed: this.isCollapsed,
      isCompleted: this.isCompleted,

      childrenCountOverride: this.childrenCountOverride,
      completedChildrenCountOverride: this.completedChildrenCountOverride,
    };
  }

  deserialize(data) {
    this.id = data.id ?? uuidv4();

    this.label = data.label ?? "A task";
    this.weight = data.weight ?? 1;

    this.isCollapsed = data.isCollapsed ?? false;
    this.isCompleted = data.isCompleted ?? false;

    this.childrenCountOverride = data.childrenCountOverride ?? 0;
    this.completedChildrenCountOverride =
      data.completedChildrenCountOverride ?? 0;

    return this;
  }

  dispose() {
    const children = [this, ...this.getChildren(true)];
    for (const child of children) {
      this.tree.removeNode(child);
      this.parent?.removeChild(child);
    }
  }
}
