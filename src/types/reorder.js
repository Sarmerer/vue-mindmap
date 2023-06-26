const DUMMY_PARENT = 1;

export class Reorder {
  constructor(tree) {
    this.tree = tree;

    this.activeNode = null;
    this.oldParent = null;
    this.oldIndex = null;
    this.wasCollapsed = false;
    this.potentialRelative = null;

    this.grabOffsetX = 0;
    this.grabOffsetX = 0;

    this.listeners = {
      update: this.update.bind(this),
      end: this.end.bind(this),
    };
  }

  maybeStart(node) {
    node.setActive(true);

    let initialX = this.tree.canvas.cursorX;
    let initialY = this.tree.canvas.cursorY;

    const maybeStart_ = () => {
      const dx = Math.abs(this.tree.canvas.cursorX - initialX);
      const dy = Math.abs(this.tree.canvas.cursorY - initialY);
      if (dx < 15 && dy < 15) return;

      this.start(node);
    };

    const cancel = () => window.removeEventListener("mousemove", maybeStart_);

    window.addEventListener("mousemove", maybeStart_);
    window.addEventListener("mouseup", cancel, { once: true });
  }

  start(node) {
    if (this.activeNode) return;
    if (node.isRoot) return;

    node.isReordering = true;

    this.activeNode = node;
    this.oldParent = node.parent;
    this.oldIndex = node.parent.children.indexOf(node);

    this.wasCollapsed = this.activeNode.isCollapsed;
    this.activeNode.isCollapsed = true;

    this.tree.setActiveNode(this.activeNode);
    this.activeNode.setParent(null);
    this.activeNode.parent = DUMMY_PARENT;

    this.grabOffsetX = this.tree.canvas.cursorX - this.activeNode.x;
    this.grabOffsetX = this.tree.canvas.cursorY - this.activeNode.y;

    window.addEventListener("mousemove", this.listeners.update);
    window.addEventListener("mouseup", this.listeners.end, { once: true });
  }

  update() {
    if (!this.activeNode) return;

    this.activeNode.x = this.tree.canvas.cursorX - this.grabOffsetX;
    this.activeNode.y = this.tree.canvas.cursorY - this.grabOffsetX;

    const closestNode = this.getClosestNode(this.activeNode);
    if (!closestNode) {
      this.setPotentialRelative(null);
      return;
    }

    const quadrant = this.getHoveredQuadrant(
      this.tree.canvas.cursorX,
      this.tree.canvas.cursorY,
      closestNode
    );
    if (!quadrant) return;

    this.setPotentialRelative(closestNode, quadrant);
    closestNode.highlight(quadrant);
  }

  end() {
    if (!this.activeNode) return;

    this.activeNode.isReordering = false;
    this.reorder();

    if (!this.wasCollapsed) {
      this.activeNode.isCollapsed = false;
    }

    this.activeNode = null;
    this.oldParent = null;
    this.wasCollapsed = false;

    this.tree.renderer.render();

    window.removeEventListener("mousemove", this.listeners.update);
  }

  reorder() {
    if (!this.activeNode) return;

    if (!this.potentialRelative) {
      this.activeNode.parent = this.oldParent;
      this.activeNode.parent.children.splice(this.oldIndex, 0, this.activeNode);
      return;
    }

    switch (this.potentialRelative.highlightedSide) {
      case "right":
        this.activeNode.setParent(this.potentialRelative);
        break;
      case "top":
        this.makeSibling(this.potentialRelative, 0);
        break;
      case "bottom":
        this.makeSibling(this.potentialRelative, 1);
        break;
    }

    this.setPotentialRelative(null);
  }

  makeChild(node) {
    if (node.isCollapsed) {
      node.isCollapsed = false;
    }

    this.activeNode.setParent(node);
  }

  makeSibling(node, offset) {
    if (!node.parent) return;

    this.activeNode.parent = node.parent;
    const index = node.parent.children.indexOf(node);
    node.parent.children.splice(index + offset, 0, this.activeNode);
  }

  setPotentialRelative(node, side) {
    if (this.potentialRelative === node) return;

    if (this.potentialRelative) {
      this.potentialRelative.highlight(null);
    }

    this.potentialRelative = node;

    if (this.potentialRelative) {
      this.potentialRelative.highlight(side || null);
    }
  }

  getClosestNode(node) {
    let closestNode = null;
    let closestDistance = Infinity;
    for (const otherNode of this.tree.getNodes()) {
      if (otherNode === node || otherNode.isRoot) continue;

      const distance = this.getDistance(node, otherNode);
      if (distance === null || distance > closestDistance) continue;

      closestNode = otherNode;
      closestDistance = distance;
    }

    return closestNode;
  }

  getDistance(node, otherNode) {
    if (
      node.x < otherNode.x - otherNode.width ||
      node.x > otherNode.x + otherNode.width ||
      node.y < otherNode.y - otherNode.height ||
      node.y > otherNode.y + otherNode.height
    ) {
      return null;
    }

    return Math.sqrt(
      Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
    );
  }

  getHoveredQuadrant(x, y, otherNode) {
    const centerY = otherNode.y + otherNode.height / 2;
    const rightBoundary = otherNode.x + (2 / 3) * otherNode.width;

    if (x > rightBoundary) {
      return "right";
    } else if (y < centerY) {
      return "top";
    } else if (y > centerY) {
      return "bottom";
    }

    return null;
  }
}
