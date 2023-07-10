<template>
  <div class="toolbar">
    <div class="left-actions">
      <ToolbarAction
        v-for="action in leftActions"
        :key="action.id"
        v-bind="{ action }"
      />
    </div>

    <div class="right-actions">
      <ToolbarAction
        v-for="action in rightActions"
        :key="action.id"
        v-bind="{ action }"
      />
    </div>
  </div>
</template>

<script>
import { Tree } from "../modules/tree/types/tree";

import ToolbarAction from "./ToolbarAction.vue";
export default {
  name: "Toolbar",

  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  components: { ToolbarAction },

  computed: {
    leftActions() {
      return this.orderedActions.filter(
        (action) => action.toolbarGroupId === "left" && action.when()
      );
    },

    rightActions() {
      return this.orderedActions.filter(
        (action) => action.toolbarGroupId === "right" && action.when()
      );
    },

    orderedActions() {
      return [...this.tree.actionsManager.actions].sort((a, b) => {
        if (a.toolbarOrder === b.toolbarOrder) return 0;
        return a.toolbarOrder > b.toolbarOrder ? 1 : -1;
      });
    },
  },
};
</script>
<style scoped>
.toolbar {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;

  justify-content: space-between;
  align-items: center;
  z-index: 1;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: var(--color-toolbar-background);
  padding: 0 8px;
  height: 48px;
}

.left-actions,
.right-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
