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

    this.label = Math.random().toString(36).substring(2, 15);
    this.weight = 1;
    this.highlightedSide = null;

    this.isActive = false;
    this.isReordering = false;
    this.isEditing = false;
    this.isCollapsed = false;
    this.isCompleted = false;
  }

  get isRoot() {
    return this.parent === null;
  }

  setEditing(isEditing) {
    this.isEditing = isEditing;
    this.tree.renderer.render();
  }

  setCollapsed(isCollapsed) {
    this.isCollapsed = isCollapsed;
    this.tree.renderer.render();
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
    this.tree.renderer.render();
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

  getChildren() {
    if (this.isCollapsed) return [];

    return this.children;
  }

  getChildrenCount(deep = false) {
    let count = this.children.length;

    if (deep) {
      for (const child of this.children) {
        count += child.getChildrenCount(true);
      }
    }

    return count;
  }

  getCompletedChildrenCount(deep = false) {
    let count = 0;

    for (const child of this.children) {
      if (child.isCompleted) count++;

      if (deep) count += child.getCompletedChildrenCount(true);
    }

    return count;
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
    };
  }
}