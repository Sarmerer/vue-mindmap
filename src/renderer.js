import { Tree } from "./tree.r";

import { flextree } from "d3-flextree";
import * as d3 from "d3";

export class Renderer {
  /**
   * @param {Tree} tree
   */
  constructor(tree) {
    this.tree = tree;
  }

  render() {
    setTimeout(this.#render.bind(this), 0);
  }

  #render() {
    const roots = this.tree.getRoots();
    if (!roots.length) return;

    const treeFactory = d3.tree();
    const tree = treeFactory(this.buildHierarchy(roots[0]));

    const layoutFactory = flextree({
      nodeSize: (node) => {
        node.data.measure();
        return [node.data.height, node.data.width + 30];
      },

      spacing: (nodeA, nodeB) => nodeA.path(nodeB).length,
    });

    const layout = layoutFactory(tree);

    layout.each((node) => {
      node.x = node.x + 200;
      node.y = node.y + 100;
    });

    for (const node of layout.descendants()) {
      const matchingNode = this.tree.nodes.find(
        ({ id }) => id === node.data.id
      );
      if (!matchingNode) continue;

      matchingNode.x = node.y;
      matchingNode.y = node.x;
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

    // return `${base}M${sourceRight},${sourceBottom}L${target.x},${targetBottom}L${targetRight},${targetBottom}`;
  }
}
