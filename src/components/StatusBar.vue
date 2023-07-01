<template>
  <footer class="statusbar">
    <div class="statusbar__left">
      <span class="statusbar__item">
        <span class="statusbar__item__label">Nodes:</span>
        <span class="statusbar__item__value" v-text="totalNodes"></span>
      </span>
      <span class="statusbar__item">
        <span class="statusbar__item__label">Active:</span>
        <span class="statusbar__item__value" v-text="activeNodeLabel"></span>
      </span>
    </div>
    <div class="statusbar__right">
      <span class="statusbar__item">
        <span class="statusbar__item__label">Zoom:</span>
        <span class="statusbar__item__value" v-text="zoomLevel"></span>
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
    totalNodes() {
      return this.tree.nodes.length;
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
  border-top: 1px solid #e5e5e5;
  background-color: white;
  padding: 0 8px;
  height: 24px;
}

.statusbar__left,
.statusbar__right {
  display: flex;
  align-items: center;
}

.statusbar__item {
  display: flex;
  align-items: center;
  padding: 0 4px;
}

.statusbar__item:not(:last-child) {
  border-right: 1px solid #e5e5e5;
}

.statusbar__item__label {
  font-size: 12px;
}

.statusbar__item__value {
  margin-left: 4px;
  font-weight: bold;
  font-size: 12px;
}
</style>
