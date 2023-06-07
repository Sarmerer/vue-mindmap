import { Stateful, StatefulRecursive } from "./stateful";
import { uuidv4 } from "./utils";

export class Node {
  constructor(tree) {
    this.tree = tree;

    this.id = uuidv4();
    this.parent = null;
    this.children = new Map();

    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;

    this.label =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    this.weight = 1;

    this.isActive = new Stateful();
    this.isEditing = new Stateful();
    this.isCollapsed = new Stateful();
    this.isCompleted = new StatefulRecursive(this, "isCompleted");
  }

  get isRoot() {
    return this.parent === null;
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
    const node = new Node(this.tree);
    node.setParent(this);
    this.tree.addNode(node);
    return node;
  }

  setParent(parent) {
    if (parent) {
      parent.children.set(this.id, this);
    }

    this.parent = parent;
  }

  setLabel(label) {
    this.label = label;
    this.tree.renderer.render();
  }

  setActive() {
    this.tree.setActiveNode(this);
  }

  getChildren() {
    if (this.isCollapsed.get()) return [];

    return Array.from(this.children.values());
  }

  getChildrenCount() {
    let count = 0;
    for (const child of this.children.values()) {
      count += 1 + child.getChildrenCount();
    }

    return count;
  }

  getCompletedChildrenCount() {
    let count = 0;
    for (const child of this.children.values()) {
      if (!child.isCompleted.get()) continue;

      count += 1 + child.getCompletedChildrenCount();
    }

    return count;
  }

  measure() {
    const el = document.getElementById(this.id);
    if (!el) return;

    const { width, height } = el.getBoundingClientRect();
    this.width = width;
    this.height = height;
  }

  serialize() {
    return {
      id: this.id,
      parent: this.parent?.id ?? null,
      label: this.label,
      weight: this.weight,
      isCollapsed: this.isCollapsed.get(),
      isCompleted: this.isCompleted.get(),
    };
  }

  dispose() {}
}
