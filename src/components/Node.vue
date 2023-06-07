<template>
  <div
    :id="node.id"
    class="node"
    :class="{
      active: node.isActive.state,
      completed,
    }"
    :style="{ translate: `${node.x}px ${node.y}px` }"
    @contextmenu.stop.prevent="openContextMenu($event)"
    @click.stop.prevent="node.setActive()"
    @dblclick.stop.prevent="node.isEditing.set(true)"
  >
    <div v-if="!node.isEditing.state" class="node__content">
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
      <textarea
        ref="labelTextarea"
        @focusout="node.isEditing.set(false)"
        @keydown.prevent.stop.enter="setLabel"
      ></textarea>
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
    "node.isEditing.state"(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.labelTextarea.focus();
        });
      }
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

    completed() {
      return this.node.isCompleted.state;
    },
  },

  methods: {
    setLabel(e) {
      this.node.isEditing.set(false);
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
  padding: 8px;
  user-select: none;
}

.node.active {
  z-index: 1;
  cursor: grab;
  box-shadow: 0 0 0 2px var(--secondary-clr);
  border: 1px solid #ccc;
  background-color: #f0f0f0;
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

  font-size: 16px;
  text-align: center;
  white-space: break-spaces;
}

.node.completed .node__label {
  text-decoration: line-through;
}

.node__progress__text {
  user-select: none;
}

.node__progress__bar {
  position: absolute;
  bottom: -10px;
  left: 0;
  border: 1px solid black;
  border-radius: 4px;
  background-color: black;
  width: 100%;
  height: 6px;
}

.node__progress__fill {
  transition: width 1s ease;
  background-color: #2cbd2c;
  height: 100%;
}
</style>
