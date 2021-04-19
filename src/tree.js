import { store } from "@/store2.0";

class Node {
  constructor(
    globalID = 0,
    id = 0,
    parentNode = null,
    depth = 0,
    override = {
      name: "",
      firstEdit: true,
      collapsed: false,
      children: [],
      emoji: [],
      done: false,
      settings: {
        displayProgress: true,
        deepProgress: true,
      },
    }
  ) {
    this._gid = globalID;
    this._id = id;
    this._name = override.name;
    this._parentNode = parentNode;
    this._children = override.children;
    this._collapsed = override.collapsed;
    this._depth = depth;
    this._editing = !override.firstEdit ? false : parentNode !== null;
    this._firstEdit = override.firstEdit;
    this._emoji = override.emoji || [];
    this._done = override.done;

    this._settings = {
      displayProgress:
        override.settings?.displayProgress === true ? true : false,
      deepProgress: override.settings?.deepProgress === true ? true : false,
    };
  }

  addChild(node) {
    if (!(node instanceof Node)) return;
    this._children.push(node);
  }

  addChildAtIndex(node, index) {
    if (!(node instanceof Node) || index < 0) return;
    this._children.splice(index, 0, node);
  }

  toggleEmoji(emoji) {
    this._emoji.includes(emoji)
      ? this._emoji.splice(this._emoji.indexOf(emoji), 1)
      : this._emoji.push(emoji);
  }

  toggleDoneState() {
    this._done = !this._done;
  }

  getChildren() {
    return this._children;
  }

  delete() {
    const index = this._parentNode._children.indexOf(this);
    this._parentNode.children.splice(index, 1);
  }

  setSetting(key, value) {
    if (this._settings[key] === undefined) return;
    this._settings[key] = value;
  }

  toggleSetting(key) {
    if (
      this._settings[key] === undefined ||
      typeof this._settings[key] !== "boolean"
    )
      return;
    this.setSetting(key, !this._settings[key]);
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

  get editing() {
    return this._editing;
  }

  get depth() {
    return this._depth;
  }

  get childrenLength() {
    return this._children.length;
  }

  get firstEdit() {
    return this._firstEdit;
  }

  get emoji() {
    return this._emoji;
  }

  get done() {
    return this._done;
  }

  get progress() {
    const { percentage } = this._settings.deepProgress
      ? this.deepProgress
      : this.shallowProgress;

    return percentage;
  }

  get deepProgress() {
    if (this._children.length) {
      let sum = 0;
      let totalNodes = this._children.length;
      this._children.forEach((c) => {
        sum += c.done ? 1 : 0;
        if (c._children.length) {
          let { sum: cSum, totalNodes: cTN } = c.deepProgress;
          sum += cSum;
          totalNodes += cTN;
        }
      });
      return {
        sum,
        totalNodes,
        percentage: ((sum / totalNodes) * 100).toFixed(0),
      };
    }
    return { sum: 0, totalNodes: 0, percentage: 0 };
  }

  get shallowProgress() {
    if (this._children.length) {
      let sum = 0;
      let totalNodes = this._children.length;
      this._children.forEach((c) => (sum += c.done ? 1 : 0));
      return {
        sum,
        totalNodes,
        percentage: ((sum / totalNodes) * 100).toFixed(0),
      };
    }
    return { sum: 0, totalNodes: 0, percentage: 0 };
  }

  get settings() {
    return this._settings;
  }

  set id(value) {
    this._id = value;
  }

  set name(value) {
    this._name = value;
    this.editing = false;
  }

  set editing(value) {
    this._editing = value;
    this._firstEdit = false;
  }

  set collapsed(value) {
    if (this._children.length) this._collapsed = value;
  }

  set children(value) {
    this._children = value;
  }

  set parent(value) {
    this._parentNode = value;
  }

  set done(value) {
    this._done = value ? true : false;
  }
}

class Tree {
  constructor() {
    this._name = "root";
    this._root = new Node(this.counter, 0, null, 0, { name: "root" });
    this.lastNode = this._root;
    this._query = [];
    this._counter = 0;
    this.isRoot = true;
    this.loaded = false;
    store.dispatch("getTreeData").then((data) => {
      this.parseTreeData(data);
      this.loaded = true;
    });
  }

  addSibling() {
    if (this._lastNode.editing) {
      this._lastNode.editing = false;
      this._lastNode._name = this._lastNode._name.trim();
      return;
    }
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
      this._lastNode.editing = false;
      this._lastNode._name = this._lastNode._name.trim();
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

  cloneNode(node, destination, position) {
    const self = this;
    function deepClone(node, parent) {
      const newNode = new Node(self.counter, node.id, parent, node.depth, {
        name: node.name,
        collapsed: false,
        firstEdit: node.firstEdit,
        children: [],
        done: node.done,
        settings: node.settings,
      });
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

  editLastNode() {
    if (this._lastNode.editing) return;
    this._lastNode.editing = true;
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

  exportToStore() {
    return parse(this._query.length ? this._query[0] : this._root);
    function parse(data) {
      return {
        name: data.name,
        collapsed: data.collapsed || false,
        done: data.done || false,
        settings: data.settings,
        children: data.getChildren()?.length
          ? data.getChildren().map((c) =>
              c.getChildren().length
                ? parse(c)
                : {
                    name: c.name,
                    children: [],
                    emoji: c.emoji,
                    done: c.done,
                    settings: c.settings,
                  }
            )
          : [],
        emoji: data.emoji,
      };
    }
  }

  parseTreeData(treeData) {
    if (!treeData) return;
    let self = this;
    this._root.children = [];
    this._lastNode = this._root;
    this._counter = 0;
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
        {
          name: data.name,
          firstEdit: false,
          collapsed: data.collapsed || false,
          emoji: data.emoji,
          done: data.done,
          settings: data.settings,
        }
      );
      newNode.children = data.children.length
        ? parseChildren(data, newNode)
        : [];
      parent.children.push(newNode);
    }

    function parseChildren(data, parent) {
      return data?.children?.map((child, index) => {
        let newNode = new Node(self.counter, index, parent, parent.depth + 1, {
          name: child.name,
          firstEdit: false,
          collapsed: child.collapsed || false,
          emoji: child.emoji,
          done: child.done,
          settings: child.settings,
        });
        newNode.children = child?.children.length
          ? parseChildren(child, newNode)
          : [];
        return newNode;
      });
    }
  }

  spliceRootsQuery(n) {
    if (n <= 0 || n > this._query.length) return;
    if (n > 1) this._query = this._query.slice(0, -(n - 1));
    const newRoot = this._query.pop();
    this._name = newRoot.name;
    this._root = newRoot;
  }

  pushRootToQuery(newRoot) {
    if (!newRoot || !(newRoot instanceof Node)) return;
    this._query.push(this._root);
    newRoot.collapsed = false;
    this._root = newRoot;
  }

  sortLastNode(by, direction) {
    console.log(by, direction);
    this.lastNode._children.sort((a, b) => (a.name < b.name ? -1 : 1));
  }

  get name() {
    return this._root.name;
  }

  get children() {
    return this._root.children;
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
    return this._counter++;
  }

  get root() {
    return this._root;
  }

  get query() {
    return this._query;
  }

  get emoji() {
    return this._root.emoji;
  }

  set lastNode(node) {
    if (!(node instanceof Node))
      return !node?._root
        ? console.error(`${node} is not instance of Node`)
        : null;

    if (this?._lastNode?.editing) this._lastNode.editing = false;
    this._lastNode = node;
  }
}

export const tree = new Tree();
