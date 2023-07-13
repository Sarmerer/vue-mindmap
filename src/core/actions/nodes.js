import { defineActions } from "../../modules/mindmap/types/actions-manager";
import { Node } from "../../modules/tree";

export default defineActions(
  {
    id: "add-root",
    toolbarGroupId: "left",
    label: "Add root",
    icon: "git-fork",
    hotkeys: ["enter"],
    when: ({ tree }) => tree.nodes.length === 0,
    run({ tree }) {
      tree.canvas.reset();

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
    when: ({ tree }) => tree.activeNode?.isActionable,
    run({ tree }) {
      const node = tree.activeNode.addChild();
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
    when: ({ tree }) => tree.activeNode?.isActionable && tree.activeNode.parent,
    run({ tree }) {
      const node = tree.activeNode.addSibling();
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
    when: ({ tree }) =>
      tree.activeNode?.isActionable &&
      tree.activeNode.children.length > 0 &&
      !tree.activeNode.isCollapsed,
    run({ tree }) {
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
    when: ({ tree }) =>
      tree.activeNode?.isActionable &&
      tree.activeNode.children.length > 0 &&
      tree.activeNode.isCollapsed,
    run({ tree }) {
      tree.activeNode.setCollapsed(false);
    },
  },

  {
    id: "edit",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Edit",
    icon: "pencil",
    hotkeys: ["e", "f2"],
    when: ({ tree }) => tree.activeNode?.isActionable,
    run({ tree }) {
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
    when: ({ tree }) =>
      tree.activeNode?.isActionable && !tree.activeNode.isCompleted,
    run({ tree }) {
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
    when: ({ tree }) =>
      tree.activeNode?.isActionable && tree.activeNode.isCompleted,
    run({ tree }) {
      tree.activeNode.isCompleted = false;
    },
  },
  {
    id: "done-deep",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Done deep",
    icon: "check-square",
    hotkeys: ["shift+d"],
    when: ({ tree }) =>
      tree.activeNode?.isActionable && !tree.activeNode.isCompletedDeep,
    run({ tree }) {
      tree.activeNode.setCompleted(true, true);
    },
  },
  {
    id: "undone-deep",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Undo deep",
    icon: "x-square",
    hotkeys: ["shift+d"],
    when: ({ tree }) =>
      tree.activeNode?.isActionable && tree.activeNode.isCompletedDeep,
    run({ tree }) {
      tree.activeNode.setCompleted(false, true);
    },
  },
  {
    id: "drill-down",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Drill down",
    icon: "arrow-down-square",
    when: ({ tree }) =>
      tree.activeNode?.isActionable && !tree.activeNode.isRoot,
    run({ tree }) {
      tree.pushStack(tree.activeNode);
    },
  },
  {
    id: "drill-up",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Drill up",
    icon: "arrow-up-square",
    when: ({ tree }) => tree.rootsStack.length > 0,
    run({ tree }) {
      tree.popStack();
    },
  },
  {
    id: "delete",
    toolbarGroupId: "left",
    contextMenuGroupId: "node",
    label: "Delete",
    icon: "trash",
    hotkeys: ["delete", "backspace"],
    when: ({ tree }) => tree.activeNode?.isActionable,
    run({ tree }) {
      const nextActive =
        tree.navigator.getClosestNode(tree.activeNode, "left") || null;

      tree.activeNode.dispose();
      tree.setActiveNode(nextActive);
    },
  },

  {
    id: "set-weight",
    contextMenuGroupId: "node",
    label: "Set weight",
    icon: "scale",
    hotkeys: ["w"],
    when: ({ tree }) => tree.activeNode?.isActionable,
    run({ tree }) {
      const input = prompt("Enter node weight", tree.activeNode.weight);
      const weight = parseInt(input);
      if (isNaN(weight)) return;

      tree.activeNode.weight = weight <= 0 ? 1 : weight;
      tree.renderer.render();
    },
  },
  {
    id: "override-children",
    contextMenuGroupId: "node",
    label: "Override children",
    icon: "redo-dot",
    hotkeys: ["o"],
    when: ({ tree }) => tree.activeNode?.isActionable,
    run({ tree }) {
      const input = prompt(
        "Enter node children override (e.g. 2/10), leave empty to remove override",
        tree.activeNode.childrenOverride
      );
      if (!input) {
        tree.activeNode.childrenCountOverride = 0;
        tree.activeNode.completedChildrenCountOverride = 0;
        tree.renderer.render();
        return;
      }

      const [completedRaw, totalRaw] = input.split("/");
      const completed = parseInt(completedRaw);
      const total = parseInt(totalRaw);
      if (isNaN(completed) || isNaN(total)) return;
      if (completed > total) return;

      tree.activeNode.childrenCountOverride = total;
      tree.activeNode.completedChildrenCountOverride = completed;
      tree.renderer.render();
    },
  },

  {
    id: "go-left",
    label: "Go left",
    icon: "arrow-left",
    hotkeys: ["arrowleft"],
    when: ({ tree }) => tree.activeNode,
    run({ tree }) {
      tree.navigator.go("left");
    },
  },
  {
    id: "go-right",
    label: "Go right",
    icon: "arrow-right",
    hotkeys: ["arrowright"],
    when: ({ tree }) => tree.activeNode,
    run({ tree }) {
      tree.navigator.go("right");
    },
  },
  {
    id: "go-up",
    label: "Go up",
    icon: "arrow-up",
    hotkeys: ["arrowup"],
    when: ({ tree }) => tree.activeNode,
    run({ tree }) {
      tree.navigator.go("up");
    },
  },
  {
    id: "go-down",
    label: "Go down",
    icon: "arrow-down",
    hotkeys: ["arrowdown"],
    when: ({ tree }) => tree.activeNode,
    run({ tree }) {
      tree.navigator.go("down");
    },
  }
);
