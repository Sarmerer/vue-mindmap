import { ActionsManager } from "./actions-manager";
import { EmojiManager } from "./emiji-manager";
import { Navigator } from "./navigator";
import { Reorder } from "./reorder";
import { Canvas } from "./canvas";
import { Renderer } from "./renderer";
import { Database } from "./database/generic";
import { Node } from "./node";

import { uuidv4 } from "../utils";

export class Tree {
  constructor() {
    this.id = uuidv4();
    this.label = "Untitled";

    this.activeNode = null;

    this.nodes = [];
    this.links = [];

    this.actionsManager = new ActionsManager(this);
    this.navigator = new Navigator(this)
    this.emojiManager = new EmojiManager(this);
    this.reorder = new Reorder(this);
    this.rootsStack = [];

    this.canvas = new Canvas();
    this.renderer = new Renderer(this);
    this.database = null;
  }

  getRoot() {
    if (this.rootsStack.length) return this.rootsStack.at(-1);

    return this.nodes.find((node) => node.isRoot);
  }

  getNodes() {
    const root = this.getRoot();
    if (!root) return [];

    const nodes = [root, ...root.getChildren(true)];

    const reorderingNode = this.reorder.activeNode;
    if (reorderingNode) {
      nodes.push(reorderingNode);
    }

    return nodes;
  }

  addNode(node) {
    this.nodes.push(node);
    this.renderer.render();
  }

  addNodeAndActivate(node) {
    this.addNode(node);
    this.setActiveNode(node);
  }

  setActiveNode(node) {
    this.activeNode = node;
  }

  pushStack(node) {
    this.rootsStack.push(node);
    this.renderer.render();
  }

  popStack() {
    this.rootsStack.pop();
    this.renderer.render();
  }

  /**
   * @param {Database} database
   */
  setDatabase(database) {
    this.database = database;
  }

  serialize() {
    return {
      id: this.id,
      label: this.label,
      nodes: this.nodes.map((node) => node.serialize()),
      activeNode: this.activeNode?.id ?? null,
    };
  }

  deserialize(data) {
    if (!data) return this;

    const index = new Map();
    const dataNodes = data.nodes ?? [];

    const nodes = dataNodes.map((nodeData) => {
      const node = new Node(this).deserialize(nodeData);
      index.set(node.id, node);
      return node;
    });

    for (const node of dataNodes) {
      if (node.parent && index.has(node.parent)) {
        const parent = index.get(node.parent);
        if (!parent) continue;

        const self = index.get(node.id);
        self.parent = parent;
        parent.children.push(self);
      }
    }

    this.id = data.id;
    this.label = data.label;

    this.nodes = nodes;
    this.setActiveNode(index.get(data.activeNode ?? null));

    return this;
  }
}
