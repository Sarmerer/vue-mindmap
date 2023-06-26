<template>
  <div
    :id="node.id"
    class="node"
    :class="{
      active: node.isActive,
      completed: node.isCompleted,
      reordering: node.isReordering,
      [`highlight--${node.highlightedSide}`]: node.highlightedSide,
    }"
    :style="{ translate: `${node.x}px ${node.y}px` }"
    @dblclick.stop.prevent="node.setEditing(true)"
    @contextmenu.stop.prevent="showContextMenu"
    @mousedown.stop.prevent="maybeReorder"
  >
    <div v-if="!node.isEditing" class="node__content">
      <p class="node__label" v-text="node.label"></p>

      <span class="node__collapsed-indicator" v-show="node.isCollapsed">
        ...
      </span>

      <div v-if="childrenCount > 0" class="node__progress">
        <small
          class="node__progress__text"
          v-text="`${completedChildrenCount}/${childrenCount}`"
        ></small>

        <div class="node__progress__bar">
          <div
            class="node__progress__fill"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <div v-else class="node__editor">
      <input
        class="node__editor__input"
        ref="labelTextarea"
        :value="node.label"
        @focusout="node.setEditing(false)"
        @keydown.prevent.stop.enter="setLabel($event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import { Node } from "../types/node";

export default {
  props: {
    node: {
      type: Node,
      required: true,
    },
  },

  watch: {
    "node.isEditing": {
      immediate: true,
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.labelTextarea.focus();
          });
        }
      },
    },
  },

  computed: {
    childrenCount() {
      return this.node.getChildrenCount();
    },

    completedChildrenCount() {
      return this.node.getCompletedChildrenCount();
    },

    progress() {
      return (this.completedChildrenCount / this.childrenCount) * 100;
    },
  },

  methods: {
    setLabel(value) {
      this.node.isEditing = false;
      this.node.setLabel(value);
    },

    showContextMenu(e) {
      this.node.setActive();
      this.$emit("contextmenu", e, this.node);
    },

    maybeReorder() {
      this.node.tree.reorder.maybeStart(this.node);
    },
  },
};
</script>

<style scoped>
.node {
  position: absolute;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: transparent;
}

.node.active {
  z-index: 1;
  cursor: grab;
  background-color: rgba(128, 128, 128, 0.3);
  user-select: auto;
}

.node.reordering {
  opacity: 0.3;
}

.node.reordering * {
  cursor: grabbing;
}

.node:has(.node__progress__bar) {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.node.highlight--top {
  box-shadow: inset 0 10px 10px -10px rgb(0, 0, 0);
}

.node.highlight--bottom {
  box-shadow: inset 0 -10px 10px -10px rgb(0, 0, 0);
}

.node.highlight--right {
  box-shadow: inset -10px 0 10px -10px rgb(0, 0, 0);
}

.node__content {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 0 4px;
}

.node__label {
  word-wrap: break-word;
  cursor: text;
  margin: 0;
  color: #333;
  font-weight: 500;

  font-size: 14px;
  user-select: none;
  text-align: center;
  white-space: break-spaces;
}

.node.completed .node__label {
  text-decoration: line-through;
}

.node__progress__text {
  font-size: 10px;
  user-select: none;
}

.node__progress__bar {
  position: absolute;
  bottom: -4px;
  left: 0;
  border-radius: 0 0 4px 4px;
  background-color: black;
  width: 100%;
  height: 3px;
  overflow: hidden;
}

.node__progress__fill {
  transition: width 1s ease;
  background-color: #2cbd2c;
  height: 100%;
}

.node__editor__input {
  width: 100%;
}
</style>
