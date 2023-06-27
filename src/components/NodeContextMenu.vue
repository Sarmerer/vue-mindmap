<template>
  <ContextMenuR ref="contextMenu" class="node-context-menu">
    <li
      v-for="action of actions"
      :key="action.id"
      @click="hide(), action.run()"
    >
      <b-icon v-if="action.icon" :icon="action.icon" size="is-small" />
      {{ action.label }}
    </li>
  </ContextMenuR>
</template>

<script>
import { Tree } from "../types/tree";

import ContextMenuR from "./ContextMenu.r.vue";

export default {
  props: {
    tree: {
      type: Tree,
      required: true,
    },
  },

  components: { ContextMenuR },

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
  background-color: #293845;
  padding: 8px 0;
}

.node-context-menu li {
  padding: 4px 16px;
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
}

.node-context-menu li:hover {
  background-color: #a03bc3;
}
</style>
