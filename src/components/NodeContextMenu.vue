<template>
  <BaseContextMenu ref="contextMenu" class="node-context-menu">
    <li
      v-for="action of actions"
      :key="action.id"
      @click="hide(), action.run()"
    >
      <BaseIcon v-if="action.icon" :icon="action.icon" :size="14" />
      {{ action.label }}
    </li>
  </BaseContextMenu>
</template>

<script>
import { Tree } from "../types/tree";

export default {
  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  computed: {
    actions() {
      const actions = [];

      for (const action of this.tree.actionsManager.actions) {
        if (!action.contextMenuGroupId || !action.when(this.tree)) continue;

        actions.push(action);
      }

      return actions;
    },
  },

  methods: {
    show(e) {
      this.$refs.contextMenu.show(e);
    },

    hide() {
      this.$refs.contextMenu.hide();
    },
  },
};
</script>

<style scoped>
.node-context-menu {
  border-radius: 4px;
  background-color: var(--color-main-foreground);
  padding: 8px 0;
}

.node-context-menu li {
  display: flex;
  align-items: center;
  gap: 8px;

  cursor: pointer;
  padding: 4px 16px;
  color: var(--color-main-background);
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
}

.node-context-menu li:hover {
  background-color: var(--color-main-foreground-hover);
  color: var(--color-main-text);
}
</style>
