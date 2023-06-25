export class Navigator {
  constructor(tree) {
    this.tree = tree;
  }

  up() {
    if (!this.tree.activeNode) return;

    const { x, y } = this.tree.activeNode;
    let closestNode = null;
    let minDistance = Infinity;

    for (const node of this.tree.getNodes()) {
      if (node === this.tree.activeNode) continue;

      const { x: nextX, y: nextY } = node;
      const distance = Math.sqrt(
        Math.pow(nextX - x, 2) + Math.pow(nextY - y, 2)
      );

      if (
        nextY < y &&
        distance < minDistance &&
        Math.abs(nextX - x) <= node.width / 2
      ) {
        closestNode = node;
        minDistance = distance;
      }
    }

    if (!closestNode) return;

    this.tree.setActiveNode(closestNode);
  }

  left() {
    if (!this.tree.activeNode) return;

    const { x, y } = this.tree.activeNode;
    let closestNode = null;
    let minDistance = Infinity;

    for (const node of this.tree.getNodes()) {
      if (node === this.tree.activeNode) continue;

      const { x: nextX, y: nextY } = node;
      const distance = Math.sqrt(
        Math.pow(nextX - x, 2) + Math.pow(nextY - y, 2)
      );

      if (
        nextX < x &&
        distance < minDistance &&
        Math.abs(nextY - y) <= node.height / 2
      ) {
        closestNode = node;
        minDistance = distance;
      }
    }

    if (!closestNode) return;

    this.tree.setActiveNode(closestNode);
  }

  down() {
    if (!this.tree.activeNode) return;

    const { x, y } = this.tree.activeNode;
    let closestNode = null;
    let minDistance = Infinity;

    for (const node of this.tree.getNodes()) {
      if (node === this.tree.activeNode) continue;

      const { x: nextX, y: nextY } = node;
      const distance = Math.sqrt(
        Math.pow(nextX - x, 2) + Math.pow(nextY - y, 2)
      );

      if (
        nextY > y &&
        distance < minDistance &&
        Math.abs(nextX - x) <= node.width / 2
      ) {
        closestNode = node;
        minDistance = distance;
      }
    }

    if (!closestNode) return;

    this.tree.setActiveNode(closestNode);
  }

  right() {
    if (!this.tree.activeNode) return;

    const { x, y } = this.tree.activeNode;
    let closestNode = null;
    let minDistance = Infinity;

    for (const node of this.tree.getNodes()) {
      if (node === this.tree.activeNode) continue;

      const { x: nextX, y: nextY } = node;
      const distance = Math.sqrt(
        Math.pow(nextX - x, 2) + Math.pow(nextY - y, 2)
      );

      if (
        nextX > x &&
        distance < minDistance &&
        Math.abs(nextY - y) <= node.height / 2
      ) {
        closestNode = node;
        minDistance = distance;
      }
    }

    if (!closestNode) return;

    this.tree.setActiveNode(closestNode);
  }
}
