import { store } from "@/store/index";
/** @type {import("./node").Node} */
import { Node } from "@/node";

class Tree {
  constructor() {
    this._gidCounter = 1;
    this._root = new Node(0, 0, null, 0, { name: "root", isRoot: true });
    this.lastNode = this._root;
    this._query = [];
    this.loaded = false;
    store.dispatch("getTreeData").then((data) => {
      this.parseTreeData(data);
      this.loaded = true;
    });
  }

  addSibling() {
    // if (this._lastNode.editing) {
    //   this._lastNode.editing = false;
    //   this._lastNode._name = this._lastNode._name.trim();
    //   return;
    // }
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
    // if (this._lastNode.editing) {
    //   this._lastNode.editing = false;
    //   this._lastNode._name = this._lastNode._name.trim();
    // }
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

  deleteLastNode(options = { force: false }) {
    if ((this._lastNode.editing || !this.lastNodeParent) && !options.force)
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
    if (this._lastNode.editing) return;
    this._lastNode.collapsed = !this._lastNode.collapsed;
  }

  blurLastNode(triggerNode) {
    if (!triggerNode || this._lastNode._gid !== triggerNode._gid) return;
    this._lastNode._firstEdit
      ? this.deleteLastNode({ force: true })
      : (this._lastNode.editing = false);
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
    if (this._lastNode.editing || !this.lastNodeParent) return;
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

  getChildren() {
    return this._root._children;
  }

  cloneNode(node, destination, position) {
    const self = this;
    function deepClone(node, parent) {
      const newNode = new Node(
        self.counter,
        node.id,
        parent,
        node.depth,
        assign(node)
      );
      newNode.children = node.getChildren().map((n) => deepClone(n, newNode));
      return newNode;
    }
    const newNode =
      position === "bottom" || position === "top"
        ? deepClone(node, destination.parent)
        : deepClone(node, destination);
    node.delete();
    if (!position || position === "right") {
      destination.addChild(newNode);
    } else if (!position || position === "top") {
      destination.parent.addChildAtIndex(
        newNode,
        destination.parent._children.indexOf(destination)
      );
    } else if (!position || position === "bottom") {
      destination.parent.addChildAtIndex(
        newNode,
        destination.parent._children.indexOf(destination) + 1
      );
    } else {
      return;
    }
    this.lastNode = newNode;
  }

  export() {
    const root = this._query.length ? this._query[0] : this._root;
    return root.export();
  }

  import(nodes) {
    if (!nodes?.children?.length) return;
    const self = this;
    for (let node of nodes.children) {
      parse(node, this.lastNode);
    }
    function parse(data, parent) {
      let newNode = new Node(
        self.counter,
        parent.children.length,
        parent,
        parent.depth + 1 || 0,
        assign(data)
      );
      newNode.children = data.children?.length
        ? parseChildren(data, newNode)
        : [];
      parent.children.push(newNode);
    }

    function parseChildren(data, parent) {
      return data?.children?.map((child, index) => {
        let newNode = new Node(
          self.counter,
          index,
          parent,
          parent.depth + 1,
          assign(child)
        );
        newNode.children = child.children?.length
          ? parseChildren(child, newNode)
          : [];
        return newNode;
      });
    }
  }

  parseTreeData(treeData) {
    if (!treeData) return;
    const self = this;
    this._root.name = treeData.name ? treeData.name : "root";
    this._root.children = [];
    this._lastNode = this._root;
    this._gidCounter = 1;
    if (!treeData.children) return;
    for (let node of treeData.children) {
      parse(node, this._root);
    }

    function parse(data, parent) {
      let newNode = new Node(
        self.counter,
        parent.children.length,
        parent,
        parent.depth + 1 || 0,
        assign(data)
      );
      newNode.children = data.children?.length
        ? parseChildren(data, newNode)
        : [];
      parent.children.push(newNode);
    }

    function parseChildren(data, parent) {
      return data?.children?.map((child, index) => {
        let newNode = new Node(
          self.counter,
          index,
          parent,
          parent.depth + 1,
          assign(child)
        );
        newNode.children = child.children?.length
          ? parseChildren(child, newNode)
          : [];
        return newNode;
      });
    }
  }

  spliceRootsQuery(spliceAmount) {
    if (spliceAmount <= 0 || spliceAmount > this._query.length) return;
    if (spliceAmount > 1)
      this._query = this._query.slice(0, -(spliceAmount - 1));
    const newRoot = this._query.pop();
    this._root.isRoot = false;
    newRoot.isRoot = true;
    this._root = newRoot;
  }

  pushRootToQuery(newRoot) {
    if (!newRoot || !(newRoot instanceof Node)) return;
    this._query.push(this._root);
    newRoot.collapsed = false;
    this._root.isRoot = false;
    newRoot.isRoot = true;
    this._root = newRoot;
  }

  sortLastNode(by, direction) {
    console.log(by, direction);
    this.lastNode._children.sort((a, b) => (a.name < b.name ? -1 : 1));
  }

  get lastNodeID() {
    return this.lastNodeParent
      ? this.lastNodeParent.children.length
      : this._root.children.length;
  }

  get lastNode() {
    return this._lastNode;
  }

  get lastNodeParent() {
    return this._lastNode?.parent || null;
  }

  get counter() {
    return this._gidCounter++;
  }

  get root() {
    return this._root;
  }

  get query() {
    return this._query;
  }

  get hasQuery() {
    return this._query?.length > 0 ? true : false;
  }

  set lastNode(node) {
    if (!(node instanceof Node))
      return !node?._root
        ? console.error(`${node} is not instance of Node`)
        : null;
    if (this._lastNode === node) return;
    if (this?._lastNode?.editing) this._lastNode.editing = false;
    this._lastNode = node;
  }
}

function assign(data) {
  return Object.assign(
    {},
    {
      name: data.name,
      firstEdit: data.firstEdit || false,
      collapsed: data.collapsed || false,
      emoji: data.emoji,
      done: data.done,
      weight: data.weight || 1,
      virtualChildren: data.virtualChildren,
      virtualFinishedChildren: data.virtualFinishedChildren,
      settings: data.settings,
    }
  );
}

export const tree = new Tree();
