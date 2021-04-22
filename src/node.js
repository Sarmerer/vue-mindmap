export class Node {
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
      isRoot: false,
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
    this._collapsed = override?.collapsed === true ? true : false;
    this._depth = depth;
    this._editing = !override.firstEdit ? false : parentNode !== null;
    this._firstEdit = override.firstEdit;
    this._emoji = override.emoji || [];
    this._done = override.done;

    this.isRoot = override?.isRoot === true ? true : false;
    this.size = [250, 250];

    this._settings = {
      displayProgress:
        override.settings?.displayProgress === false ? false : true,
      deepProgress: override.settings?.deepProgress === false ? false : true,
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

  setAllChildrenDoneState(state) {
    this._children.forEach((c) => (c.done = state ? true : false));
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

  get canDrillDown() {
    return !this.isRoot;
  }

  get canDrillUp() {
    return this.isRoot && this._parentNode != null;
  }

  get collapsible() {
    return !this._collapsed && this.childrenLength > 0;
  }

  get expandable() {
    return this._collapsed;
  }

  get draggable() {
    return !this.isRoot;
  }

  get deletable() {
    return !this.isRoot;
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
