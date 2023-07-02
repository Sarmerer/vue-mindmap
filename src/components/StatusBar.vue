<template>
  <footer class="statusbar">
    <div class="statusbar__left">
      <span
        class="statusbar__item"
        @click="tree.actionsManager.runAction('open-trees-modal')"
      >
        <span class="statusbar__item__value">
          <b-icon icon="tree-fill"></b-icon>
          {{ activeTreeLabel }}
        </span>
      </span>

      <span class="statusbar__item">
        <span class="statusbar__item__value">
          <b-icon icon="exclamation-circle"></b-icon>
          {{ nodes.todo }}

          <b-icon icon="check2-circle"></b-icon>
          {{ nodes.done }}
        </span>
      </span>

      <span class="statusbar__item">
        <span class="statusbar__item__value">
          <b-icon icon="record-circle"></b-icon>
          {{ activeNodeLabel }}
        </span>
      </span>
    </div>
    <div class="statusbar__right">
      <span class="statusbar__item">
        <span
          class="statusbar__item__value"
          v-text="`Zoom: ${zoomLevel}`"
        ></span>
      </span>
    </div>
  </footer>
</template>

<script>
import { Tree } from "../types/tree";

export default {
  props: {
    tree: Tree,
    required: true,
  },

  computed: {
    activeTreeLabel() {
      return this.tree.label;
    },

    nodes() {
      let todo = 0;
      let done = 0;
      for (const node of this.tree.nodes) {
        if (node.isCompleted) {
          done++;
        } else {
          todo++;
        }
      }

      return { todo, done };
    },

    activeNodeLabel() {
      const activeNode = this.tree.activeNode;
      return activeNode ? activeNode.label : "None";
    },

    zoomLevel() {
      return `${Math.round(this.tree.canvas.scale * 100)}%`;
    },
  },
};
</script>

<style scoped>
.statusbar {
  display: flex;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-statusbar-separator);
  background-color: var(--color-statusbar-background);
  height: 24px;
}

.statusbar__left,
.statusbar__right {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
}

.statusbar__item {
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 4px;
  padding: 0 4px;
  height: 100%;
  user-select: none;
}

.statusbar__item:hover {
  cursor: pointer;
  background-color: var(--color-statusbar-foreground-hover);
}

.statusbar__item__value {
  color: var(--color-statusbar-text);
  font-size: 12px;
}
</style>
