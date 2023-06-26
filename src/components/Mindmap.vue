<template>
  <div class="mindmap">
    <HotkeysModal v-bind="{ tree }" />

    <Toolbar v-bind="{ tree }" />
    <TreeR v-bind="{ tree }" />
  </div>
</template>

<script>
import { Node } from "../types/node";
import { Tree } from "../types/tree";
import { Renderer } from "../types/renderer";
import { Navigator } from "../types/navigator";

import Toolbar from "./Toolbar.r.vue";
import HotkeysModal from "./modals/Hotkeys.vue";
import TreeR from "./Tree.r.vue";

export default {
  components: {
    HotkeysModal,
    Toolbar,
    TreeR,
  },

  data() {
    return {
      tree: new Tree(),
    };
  },

  mounted() {
    const limit = 100;
    let counter = 0;

    function subtree(node) {
      if (counter++ > limit) return;

      for (let i = 0; i < 5; i++) {
        const child = node.addChild();
        if (Math.random() < 0.1) {
          subtree(child);
        }
      }
    }

    const root = new Node(this.tree);
    subtree(root);
    this.tree.addNode(root);

    this.tree.actionsManager.addActions(
      {
        id: "add-child",
        toolbarGroupId: "left",
        contextMenuGroupId: "node",
        label: "Add child",
        icon: "diagram2",
        hotkeys: ["tab"],
        when: (tree) => tree.activeNode,
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
        icon: "node-plus",
        hotkeys: ["enter"],
        when: (tree) => tree.activeNode && tree.activeNode.parent,
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
        icon: "arrows-collapse",
        hotkeys: ["c"],
        when: (tree) =>
          tree.activeNode?.children.length > 0 && !tree.activeNode?.isCollapsed,
        run(tree) {
          tree.activeNode.setCollapsed(true);
        },
      },
      {
        id: "expand",
        toolbarGroupId: "left",
        contextMenuGroupId: "node",
        label: "Expand",
        icon: "arrows-expand",
        hotkeys: ["c"],
        when: (tree) => tree.activeNode?.isCollapsed,
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
        when: (tree) => tree.activeNode,
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
        when: (tree) => tree.activeNode && !tree.activeNode.isCompleted,
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
        when: (tree) => tree.activeNode && tree.activeNode.isCompleted,
        run(tree) {
          tree.activeNode.isCompleted = false;
        },
      },
      {
        id: "drill-down",
        toolbarGroupId: "left",
        contextMenuGroupId: "node",
        label: "Drill down",
        icon: "arrow-down",
        when: (tree) => tree.activeNode,
        run(tree) {
          console.log("drill down");
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
        icon: "compass",
        hotkeys: ["alt+r"],
        run(tree) {
          tree.canvas.reset();
        },
      }
    );

    this.$nextTick(() => {
      const r = new Renderer(this.tree);
      r.render();
    });
  },
};
</script>

<style scoped>
.mindmap {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
