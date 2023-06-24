import { Renderer } from "./renderer";
import { ActionsManager } from "./types/actions-manager";

export class Tree {
  constructor() {
    this.activeNode = null;

    this.nodes = [];
    this.links = [];

    this.renderer = new Renderer(this);
    this.actionsManager = new ActionsManager(this);
  }

  getRoots() {
    return this.nodes.filter((node) => node.isRoot);
  }

  getNodes() {
    return this.nodes.filter((node) => !node.isCollapsed);
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
