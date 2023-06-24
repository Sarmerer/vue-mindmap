<template>
  <div
    :id="node.id"
    class="node"
    :class="{
      active: node.isActive,
      completed: node.isCompleted,
    }"
    :style="{ translate: `${node.x}px ${node.y}px` }"
    @contextmenu.stop.prevent="openContextMenu($event)"
    @click.stop.prevent="node.setActive()"
    @dblclick.stop.prevent="node.isEditing = true"
  >
    <div v-if="!node.isEditing" class="node__content">
      <p class="node__label" v-text="node.label"></p>

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
        @focusout="node.isEditing = false"
        @keydown.prevent.stop.enter="setLabel"
      />
    </div>
  </div>
</template>

<script>
import { Node } from "../node.r";

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
    setLabel(e) {
      this.node.isEditing = false;
      this.node.setLabel(e.target.value);
    },

    openContextMenu(event) {
      this.$emit("contextmenu", event);
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
  padding: 0 4px;
  user-select: none;
}

.node.active {
  z-index: 1;
  cursor: grab;
  background-color: rgba(128, 128, 128, 0.3);
  user-select: auto;
}

.node__content {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.node__label {
  word-wrap: break-word;
  cursor: text;
  margin: 0;
  overflow: visible;
  color: #333;
  font-weight: 500;

  font-size: 14px;
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
}

.node__progress__fill {
  transition: width 1s ease;
  background-color: #2cbd2c;
  height: 100%;
}

.node__editor__input {
  font-size: 14px;
}
</style>
