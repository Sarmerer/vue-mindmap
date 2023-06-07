import { Node } from "./node.r";

export class Stateful {
  /**
   * @param {Boolean} state
   * @param {String | null} key
   */
  constructor(state = false) {
    this.state = state;
  }

  get() {
    return this.state;
  }

  set(value) {
    this.state = value;
  }

  toggle() {
    this.state = !this.state;
  }
}

export class StatefulRecursive extends Stateful {
  /**
   * @param {Node} node
   * @param {String} key
   * @param {Boolean} state
   */
  constructor(node, key, state = false) {
    super(state);

    this.node = node;
    this.key = key;
  }

  get(recursive = false) {
    if (recursive) {
      let parent = this.node.parent;
      while (parent) {
        if (!parent[this.key].get()) return false;
        parent = parent.parent;
      }
    }

    return this.state;
  }

  set(value, recursive = false) {
    if (recursive) {
      for (const child of this.node.children.values()) {
        child[this.key].set(value, true);
      }
    }

    this.state = value;
  }
}
