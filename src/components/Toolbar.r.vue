<template>
  <div class="toolbar">
    <div class="left-actions">
      <button
        v-for="action in actions.left"
        :key="action.id"
        :title="action.label"
        class="action-button"
        @click.stop="action.run()"
      >
        <b-icon :icon="action.icon"></b-icon>
      </button>
    </div>

    <div class="right-actions">
      <button
        v-for="action in actions.right"
        :key="action.id"
        :title="action.label"
        class="action-button"
        @click.stop="action.run()"
      >
        <b-icon :icon="action.icon"></b-icon>
      </button>
    </div>
  </div>
</template>

<script>
import { Tree } from "../tree.r";

export default {
  name: "Toolbar",

  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  computed: {
    actions() {
      const actions = { left: [], right: [] };

      const orderedActions = [...this.tree.actionsManager.actions].sort(
        (a, b) => {
          if (a.toolbarOrder === b.toolbarOrder) return 0;
          return a.toolbarOrder > b.toolbarOrder ? 1 : -1;
        }
      );

      for (const action of orderedActions) {
        if (!action.toolbarGroupId || !action.when()) continue;

        const group = actions[action.toolbarGroupId];
        if (!group) continue;

        group.push(action);
      }

      return actions;
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
  background-color: white;
  padding: 0 8px;
  height: 48px;
}

.left-actions,
.right-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-button {
  display: flex;
  justify-content: center;
  align-items: center;

  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
  border: 2px solid #a03bc3;
  border-radius: 4px;
  padding: 0;
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.action-button:hover {
  background-color: #a03bc3;
}

.action-button:focus,
.action-button:active {
  outline: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  background-color: #a03bc3;
}
</style>
