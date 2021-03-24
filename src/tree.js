class Node {
  constructor(
    globalID = 0,
    id = 0,
    parentNode = null,
    depth = 0,
    options = { sibling: true }
  ) {
    this._gid = globalID;
    this._id = id;
    this._name = "";
    this._fx = 100;
    this._fy = options.sibling ? 100 : 200;
    this._parentNode = parentNode;
    this._nodes = [];
    this._collapsed = false;
    this._depth = depth;
    this._editing = false; //parentNode !== null;
    this._firstEdit = true;
  }

  addChild(node) {
    if (!(node instanceof Node)) return;
    this._nodes.push(node);
  }

  collapse() {
    this._collapsed = !this.collapsed;
  }

  setName(value) {
    this.name = value;
  }

  setEditing(value) {
    this.editing = value;
  }

  get id() {
    return this._id;
  }
  get parent() {
    return this._parentNode;
  }
  get nodes() {
    return this._nodes;
  }

  get collapsed() {
    return this._collapsed;
  }

  get name() {
    return this._name;
  }

  get editing() {
    return this._editing;
  }

  get depth() {
    return this._depth;
  }

  get fx() {
    return this._fx;
  }

  get fy() {
    return this._fy;
  }

  get text() {
    return `node #${this._gid}`;
  }

  set name(value) {
    this._name = value;
    this.setEditing(false);
  }

  set editing(value) {
    this._editing = value;
    this._firstEdit = false;
  }

  set collapsed(value) {
    this._collapsed = value;
  }
}

class Tree {
  constructor() {
    this._root = this.createNode(0, null);
    this.lastNode = this._root;
    this._counter = 0;
  }

  addSibling() {
    if (this._lastNode.editing) return;
    const node = this.createNode(
      this.lastNodeID,
      !this.lastNodeParent ? this._root : this.lastNodeParent,
      this._lastNode.depth || 1
    );

    this.lastNodeParent
      ? this.pushNode(this.lastNodeParent.nodes, node)
      : this.pushNode(this._root.nodes, node);
    this.lastNode = node;
  }

  addChild() {
    if (this._lastNode.editing) {
      if (!this._lastNode._firstEdit) return;
      this.deleteLastNode();
    }
    const id = this._lastNode ? this._lastNode.nodes.length : this.lastNodeID;
    const node = this.createNode(
      id,
      this._lastNode,
      (this._lastNode.depth || 0) + 1,
      { sibling: false }
    );

    this._lastNode
      ? this.pushNode(this._lastNode.nodes, node)
      : this.pushNode(this._root, node);
    this.lastNode = node;
    this.lastNodeParent.collapsed = false;
  }

  pushNode(destination, node) {
    destination.push(node);
  }

  createNode(id = 0, parent = null, depth) {
    return new Node(this.counter, id, parent, depth);
  }

  deleteLastNode() {
    if (!this.lastNodeParent) return;

    let newLast = null;

    if (this._lastNode.id - 1 >= 0) {
      newLast = this.lastNodeParent.nodes[this._lastNode.id - 1];
    } else if (this.lastNodeParent?.parent?.nodes) {
      newLast = this.lastNodeParent.parent.nodes[
        this.lastNodeParent.parent.nodes.length - 1
      ];
    } else {
      newLast = this.lastNodeParent.parent;
    }
    this.lastNodeParent.nodes.splice(this._lastNode.id, 1);
    this.lastNode = newLast;
  }

  collapseLastNode() {
    this._lastNode.collapse();
  }

  editLastNode() {
    this._lastNode.setEditing(true);
  }

  goUp() {
    if (this._lastNode.editing) return;
    if (this._lastNode.id - 1 >= 0) {
      this.lastNode = this.lastNodeParent.nodes[this._lastNode.id - 1];
    } else {
      if (this.lastNodeParent.id > 0 && this.lastNodeParent.parent) {
        let closestTopNode;
        for (let i = this.lastNodeParent.id - 1; i >= 0; i--) {
          if (this.lastNodeParent.parent.nodes[i].nodes.length) {
            closestTopNode = this.lastNodeParent.parent.nodes[i];
            break;
          }
        }

        if (closestTopNode)
          this.lastNode = closestTopNode.nodes[closestTopNode.nodes.length - 1];
      }
    }
  }
  goDown() {
    if (this._lastNode.editing) return;
    if (this._lastNode.id + 1 < this.lastNodeParent.nodes.length) {
      this.lastNode = this.lastNodeParent.nodes[this._lastNode.id + 1];
    } else {
      if (
        this.lastNodeParent.parent &&
        this.lastNodeParent.id < this.lastNodeParent.parent.nodes.length
      ) {
        let closestBottomNode;
        for (
          let i = this.lastNodeParent.id + 1;
          i < this.lastNodeParent.parent.nodes.length;
          i++
        ) {
          if (this.lastNodeParent.parent.nodes[i].nodes.length) {
            closestBottomNode = this.lastNodeParent.parent.nodes[i];
            break;
          }
        }

        if (closestBottomNode) this.lastNode = closestBottomNode.nodes[0];
      }
    }
  }

  goLeft() {
    if (this._lastNode.editing) return;
    if (!this._lastNode?.parent) return;
    this.lastNode = this._lastNode.parent;
  }

  goRight() {
    if (this._lastNode.editing) return;
    if (!this._lastNode || !this._lastNode.nodes.length) return;
    let index = Math.floor(this._lastNode.nodes.length / 2);
    this.lastNode = this._lastNode.nodes[index];
  }

  get nodes() {
    return this._root.nodes;
  }

  get lastNodeID() {
    return this.lastNodeParent
      ? this.lastNodeParent.nodes.length
      : this._root.nodes.length;
  }

  get lastNode() {
    return this._lastNode;
  }

  get lastNodeParent() {
    return this._lastNode?.parent || null;
  }

  get counter() {
    return this._counter++;
  }

  set lastNode(node) {
    if (!(node instanceof Node))
      return console.error(`${node} is not instance of Node`);
    this._lastNode = node;
  }
}

export const tree = new Tree();
