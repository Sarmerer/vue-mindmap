class Node {
  constructor(globalID = 0, id = 0, parentNode = null, depth = 0) {
    this._gid = globalID;
    this._id = id;
    this._name = "";
    this._nameEdit = "";
    this._parentNode = parentNode;
    this._children = [];
    this._collapsed = false;
    this._depth = depth;
    this._el = null;
    this._editing = parentNode !== null;
    this._firstEdit = true;
  }

  addChild(node) {
    if (!(node instanceof Node)) return;
    this._children.push(node);
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
  get children() {
    return this.collapsed ? [] : this._children;
  }

  get collapsed() {
    return this._collapsed;
  }

  get name() {
    return this._name || `node #${this._gid}`;
  }

  get nameEdit() {
    return this._nameEdit;
  }

  get editing() {
    return this._editing;
  }

  get depth() {
    return this._depth;
  }

  get childrenLength() {
    return this._children.length;
  }

  get value() {
    return this._name || `node #${this._gid}`;
  }

  get el() {
    return this._el;
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
    if (this._children.length) this._collapsed = value;
  }

  set el(el) {
    this._el = el;
  }
}

class Tree {
  constructor() {
    this._root = new Node(this.counter, 0, null, 0);
    this.lastNode = this._root;
    this._counter = 0;
  }

  addSibling() {
    if (this._lastNode.editing) return this.setLastNodeName();
    const node = this.createNode(
      this.lastNodeID,
      this.lastNodeParent ? this.lastNodeParent : this._root,
      this._lastNode.depth || 1
    );

    this.lastNodeParent
      ? this.pushNode(this.lastNodeParent.children, node)
      : this.pushNode(this._root.children, node);
    this.lastNode = node;
  }

  addChild() {
    if (this._lastNode.editing) {
      if (!this._lastNode._firstEdit) return;
      this.deleteLastNode();
    }
    const id = this._lastNode
      ? this._lastNode.children.length
      : this.lastNodeID;

    const node = this.createNode(
      id,
      this._lastNode,
      (this._lastNode.depth || 0) + 1
    );

    this._lastNode
      ? this.pushNode(this._lastNode.children, node)
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
    if (
      (this._lastNode.editing && !this._lastNode._firstEdit) ||
      !this.lastNodeParent
    )
      return;

    let newLast = null;

    if (this._lastNode.id - 1 >= 0) {
      newLast = this.lastNodeParent.children[this._lastNode.id - 1];
    } else if (this.lastNodeParent?.parent?.children) {
      newLast = this.lastNodeParent.parent.children[
        this.lastNodeParent.parent.children.length - 1
      ];
    } else {
      newLast = this.lastNodeParent;
    }
    this.lastNodeParent.children.splice(this._lastNode.id, 1);
    this.lastNode = newLast;
  }

  collapseLastNode() {
    this._lastNode.collapsed = !this._lastNode.collapsed;
  }

  editLastNode() {
    this._lastNode.setEditing(true);
  }

  blurLastNode() {
    this._lastNode._firstEdit
      ? this.deleteLastNode()
      : (this._lastNode.editing = false);
  }

  setLastNodeName() {
    this._lastNode.name = this._lastNode.nameEdit;
    this._lastNode.editing = false;
  }

  goUp() {
    if (this._lastNode.editing) return;
    if (this._lastNode.id - 1 >= 0) {
      this.lastNode = this.lastNodeParent.children[this._lastNode.id - 1];
    } else {
      if (this.lastNodeParent?.id > 0 && this.lastNodeParent.parent) {
        let closestTopNode;
        for (let i = this.lastNodeParent.id - 1; i >= 0; i--) {
          if (this.lastNodeParent.parent.children[i].children.length) {
            closestTopNode = this.lastNodeParent.parent.children[i];
            break;
          }
        }

        if (closestTopNode)
          this.lastNode =
            closestTopNode.children[closestTopNode.children.length - 1];
      }
    }
  }
  goDown() {
    if (this._lastNode.editing) return;
    if (this._lastNode.id + 1 < this.lastNodeParent.children.length) {
      this.lastNode = this.lastNodeParent.children[this._lastNode.id + 1];
    } else {
      if (
        this.lastNodeParent.parent &&
        this.lastNodeParent.id < this.lastNodeParent.parent.children.length
      ) {
        let closestBottomNode;
        for (
          let i = this.lastNodeParent.id + 1;
          i < this.lastNodeParent.parent.children.length;
          i++
        ) {
          if (this.lastNodeParent.parent.children[i].children.length) {
            closestBottomNode = this.lastNodeParent.parent.children[i];
            break;
          }
        }

        if (closestBottomNode) this.lastNode = closestBottomNode.children[0];
      }
    }
  }

  goLeft() {
    if (this._lastNode.editing) return;
    if (!this._lastNode?.parent?.parent) return;
    this.lastNode = this._lastNode.parent;
  }

  goRight() {
    if (this._lastNode.editing) return;
    if (!this._lastNode || !this._lastNode.children.length) return;
    let index = Math.floor(this._lastNode.children.length / 2);
    this.lastNode = this._lastNode.children[index];
  }

  get children() {
    return this._root.children;
  }

  get name() {
    return "root";
  }

  get connections() {
    return this._connections;
  }

  get lastNodeID() {
    return this.lastNodeParent
      ? this.lastNodeParent.children.length
      : this._root.children.length;
  }

  get lastNode() {
    return this._lastNode;
  }

  get value() {
    return "root";
  }

  get lastNodeParent() {
    return this._lastNode?.parent || null;
  }

  get counter() {
    return this._counter++;
  }

  get canvas() {
    return this._canvas;
  }

  get arrows() {
    return this._arrows;
  }

  set lastNode(node) {
    if (!(node instanceof Node))
      return !node?._root
        ? console.error(`${node} is not instance of Node`)
        : null;
    this._lastNode?.setEditing(false);
    this._lastNode = node;
  }
}

export const tree = new Tree();
