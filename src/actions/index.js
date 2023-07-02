import { Navigator } from "../types/navigator";
import { Node } from "../types/node";

export default [
  {
    id: "add-root",
    toolbarGroupId: "left",
    label: "Add root",
    icon: "git-fork",
    hotkeys: ["enter"],
    when: (tree) => tree.nodes.length === 0,
    run(tree) {
      const node = new Node(tree);
      node.isEditing = true;
      tree.addNode(node);
      tree.setActiveNode(node);
    },
  },

  {
    id: "add-child",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Add child",
    icon: "git-commit",
    hotkeys: ["tab"],
    when: (tree) => tree.activeNode?.isActionable,
    run(tree) {
      const node = this.tree.activeNode.addChild();
      node.isEditing = true;
      tree.setActiveNode(node);
    },
  },
  {
    id: "add-sibling",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Add sibling",
    icon: "git-branch",
    hotkeys: ["enter"],
    when: (tree) => tree.activeNode?.isActionable && tree.activeNode.parent,
    run(tree) {
      const node = this.tree.activeNode.addSibling();
      node.isEditing = true;
      tree.setActiveNode(node);
    },
  },

  {
    id: "collapse",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Collapse",
    icon: "fold-vertical",
    hotkeys: ["c"],
    when: (tree) =>
      tree.activeNode?.isActionable &&
      tree.activeNode.children.length > 0 &&
      !tree.activeNode.isCollapsed,
    run(tree) {
      tree.activeNode.setCollapsed(true);
    },
  },
  {
    id: "expand",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Expand",
    icon: "unfold-vertical",
    hotkeys: ["c"],
    when: (tree) =>
      tree.activeNode?.isActionable &&
      tree.activeNode.children.length > 0 &&
      tree.activeNode.isCollapsed,
    run(tree) {
      tree.activeNode.setCollapsed(false);
    },
  },

  {
    id: "edit",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Edit",
    icon: "pencil",
    hotkeys: ["e"],
    when: (tree) => tree.activeNode?.isActionable,
    run(tree) {
      tree.activeNode.setEditing(true);
    },
  },
  {
    id: "done",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Done",
    icon: "check",
    hotkeys: ["d"],
    when: (tree) =>
      tree.activeNode?.isActionable && !tree.activeNode.isCompleted,
    run(tree) {
      tree.activeNode.isCompleted = true;
    },
  },
  {
    id: "undone",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Undo",
    icon: "x",
    hotkeys: ["d"],
    when: (tree) =>
      tree.activeNode?.isActionable && tree.activeNode.isCompleted,
    run(tree) {
      tree.activeNode.isCompleted = false;
    },
  },
  {
    id: "drill-down",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Drill down",
    icon: "arrow-down-square",
    when: (tree) => tree.activeNode?.isActionable && !tree.activeNode.isRoot,
    run(tree) {
      tree.pushStack(tree.activeNode);
    },
  },
  {
    id: "drill-up",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Drill up",
    icon: "arrow-up-square",
    when: (tree) => tree.rootsStack.length > 0,
    run(tree) {
      tree.popStack();
    },
  },

  {
    id: "go-left",
    label: "Go left",
    icon: "arrow-left",
    hotkeys: ["arrowleft"],
    when: (tree) => tree.activeNode,
    run(tree) {
      const navigator = new Navigator(tree);
      navigator.left();
    },
  },
  {
    id: "go-right",
    label: "Go right",
    icon: "arrow-right",
    hotkeys: ["arrowright"],
    when: (tree) => tree.activeNode,
    run(tree) {
      const navigator = new Navigator(tree);
      navigator.right();
    },
  },
  {
    id: "go-up",
    label: "Go up",
    icon: "arrow-up",
    hotkeys: ["arrowup"],
    when: (tree) => tree.activeNode,
    run(tree) {
      const navigator = new Navigator(tree);
      navigator.up();
    },
  },
  {
    id: "go-down",
    label: "Go down",
    icon: "arrow-down",
    hotkeys: ["arrowdown"],
    when: (tree) => tree.activeNode,
    run(tree) {
      const navigator = new Navigator(tree);
      navigator.down();
    },
  },

  {
    id: "reset-canvas",
    toolbarGroupId: "right",
    toolbarOrder: 0,
    label: "Reset canvas",
    icon: "locate-fixed",
    hotkeys: ["alt+r"],
    run(tree) {
      tree.canvas.reset();
    },
  },
];
