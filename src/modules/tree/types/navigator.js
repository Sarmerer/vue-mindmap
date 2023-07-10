export class Navigator {
  constructor(tree) {
    this.tree = tree;
  }

  /**
   * @param {'up' | 'right' | 'down' | 'left'} direction
   */
  go(direction) {
    if (!this.tree.activeNode) return;

    const closestNode = this.getClosestNode(this.tree.activeNode, direction);
    if (!closestNode) return;

    this.tree.setActiveNode(closestNode);
  }

  getClosestNode(node, direction) {
    const adjacentNodes = this.getAdjacentNodes(node, direction);
    if (!adjacentNodes.length) return null;

    const { x: ax, y: ay } = node;
    let closestNode = null;
    let minDistance = Infinity;

    for (const node of adjacentNodes) {
      const { x: bx, y: by } = node;
      const distance = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
      if (distance > minDistance) continue;

      closestNode = node;
      minDistance = distance;
    }

    return closestNode;
  }

  getAdjacentNodes(node, direction) {
    const isAdjacent = {
      up: (nodeA, nodeB) => nodeA.y > nodeB.y + nodeB.height,
      down: (nodeA, nodeB) => nodeA.y + nodeA.height < nodeB.y,
      left: (nodeA, nodeB) => nodeA.x > nodeB.x + nodeB.width,
      right: (nodeA, nodeB) => nodeA.x + nodeA.width < nodeB.x,
    }[direction];

    if (!isAdjacent) return [];

    const nodes = [];
    for (const otherNode of this.tree.getNodes()) {
      if (node === otherNode) continue;
      if (!isAdjacent(node, otherNode)) continue;

      nodes.push(otherNode);
    }

    return nodes;
  }
}
