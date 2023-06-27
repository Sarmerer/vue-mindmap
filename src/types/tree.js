import { ActionsManager } from "./actions-manager";
import { EmojiManager } from "./emiji-manager";
import { Reorder } from "./reorder";
import { Canvas } from "./canvas";
import { Renderer } from "./renderer";

import { uuidv4 } from "../utils";

export class Tree {
  constructor() {
    this.id = uuidv4();

    this.activeNode = null;

    this.nodes = [];
    this.links = [];

    this.actionsManager = new ActionsManager(this);
    this.emojiManager = new EmojiManager(this);
    this.reorder = new Reorder(this);

    this.canvas = new Canvas();
    this.renderer = new Renderer(this);
  }

  getRoots() {
    return this.nodes.filter((node) => node.isRoot);
  }

  getNodes() {
    return this.nodes.filter((node) => {
      let parent = node.parent;
      while (parent) {
        if (parent.isCollapsed) return false;

        parent = parent.parent;
      }

      return true;
    });
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
    if (this.activeNode) {
      this.activeNode.isActive = false;
    }

    this.activeNode = node;

    if (this.activeNode) {
      this.activeNode.isActive = true;
    }
  }

  serialize() {
    return {
      id: this.id,
      nodes: this.nodes.map((node) => node.serialize()),
    };
  }

  deserialize(data) {
    const nodes = data.nodes.map((nodeData) => {
      const node = new Node(this);
      node.deserialize(nodeData);
      return node;
    });

    this.nodes = nodes;
  }
}