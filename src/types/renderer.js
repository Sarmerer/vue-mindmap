import { Tree } from "./tree";

import { flextree } from "d3-flextree";
import * as d3 from "d3";

export class Renderer {
  /**
   * @param {Tree} tree
   */
  constructor(tree) {
    this.tree = tree;
    this.isQueued = false;
  }

  render() {
    if (this.isQueued) return;

    window.requestAnimationFrame(() => {
      this.#render();
      this.isQueued = false;
    });
  }

  #render() {
    const root = this.tree.getRoot();
    if (!root) return;

    const treeFactory = d3.tree();
    const tree = treeFactory(this.buildHierarchy(root));

    const layoutFactory = flextree({
      nodeSize: (node) => {
        node.data.measure();
        return [node.data.height, node.data.width + 30];
      },

      spacing: (nodeA, nodeB) => nodeA.path(nodeB).length,
    });

    const layout = layoutFactory(tree);
    const screenHalfHeight = window.innerHeight / 2;
    for (const node of layout.descendants()) {
      const matchingNode = this.tree.nodes.find(
        ({ id }) => id === node.data.id
      );
      if (!matchingNode) continue;

      matchingNode.x = node.y + 100;
      matchingNode.y = node.x + screenHalfHeight;
    }

    this.tree.links = layout.links().map((link) => ({
      id: link.target.data.id,
      class: "link",
      d: this.generateLinkPath(link.source.data, link.target.data),
    }));
  }

  buildHierarchy(node) {
    return d3.hierarchy(node, (d) => d.getChildren());
  }

  generateLinkPath(source, target) {
    const sourceRight = source.x + source.width;
    const sourceBottom = source.y + source.height;
    const targetRight = target.x + target.width;
    const targetBottom = target.y + target.height;
    const curviness = 25;

    const steps = [];

    if (source.isRoot) {
      steps.push(
        `M${source.x},${sourceBottom}`,
        `L${sourceRight},${sourceBottom}`
      );
    }

    steps.push(
      `M${sourceRight},${sourceBottom}`,
      `C${sourceRight + curviness},${sourceBottom}`,
      `${target.x - curviness},${targetBottom}`,
      `${target.x},${targetBottom}`,
      `L${targetRight},${targetBottom}`
    );

    return steps.join(" ");
  }
}
