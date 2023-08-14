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
    @mousedown.stop.prevent="maybeReorder">
    <div v-if="!node.isEditing" class="node__content">
      <p class="node__label" v-text="node.label"></p>

      <span class="node__status">
        <small
          v-if="node.isCollapsed"
          title="Collapsed"
          class="node__status__item">
          <BaseIcon icon="eye-off" />
        </small>

        <small
          v-if="childrenCount > 0"
          title="Overridden progress"
          class="node__status__item node__progress__text"
          :class="{ overridden: node.isChildrenCountOverridden }">
          <BaseIcon v-if="node.isChildrenCountOverridden" icon="redo-dot" />
          <BaseIcon v-else icon="check-check" />
          {{ completedChildrenCount }}/{{ childrenCount }}
        </small>

        <small v-if="node.weight > 1" title="Weight" class="node__status__item">
          <BaseIcon icon="scale" />
          {{ node.weight }}
        </small>

        <div v-if="childrenCount > 0" class="node__progress__bar">
          <div
            class="node__progress__fill"
            :style="{ width: `${progress}%` }"></div>
        </div>
      </span>
    </div>

    <div v-else class="node__editor">
      <BaseInput
        class="node__editor__input"
        autofocus
        autoselect
        :value="node.label"
        placeholder="Name your task..."
        @focusout="node.setEditing(false)"
        @enter="setLabel($event.target.value)"
        @escape="node.setEditing(false)" />
    </div>
  </div>
</template>

<script>
import { Node } from '../types/node'

export default {
  props: {
    node: {
      type: Node,
      required: true,
    },
  },

  computed: {
    childrenCount() {
      return this.node.stats.getChildrenCount(true)
    },

    completedChildrenCount() {
      return this.node.stats.getCompletedChildrenCount(true)
    },

    progress() {
      return this.node.stats.getChildrenProgress(true)
    },
  },

  methods: {
    setLabel(value) {
      this.node.isEditing = false
      this.node.setLabel(value)
    },

    maybeReorder() {
      this.node.tree.reorder.maybeStart(this.node)
    },
  },
}
</script>

<style scoped>
.node {
  position: absolute;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: transparent;
  min-width: 18px;
  min-height: 18px;
}

.node.active {
  z-index: 1;
  cursor: grab;
  background-color: var(--color-tree-node-background-active);
  user-select: auto;
}

.node.reordering {
  opacity: 0.3;
}

.node.reordering * {
  cursor: grabbing;
}

.node:not(.active):has(.node__label:empty) {
  opacity: 0.3;
  background-color: var(--color-tree-node-background-active);
}

.node:has(.node__progress__bar) {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.node.highlight--top {
  box-shadow: inset 0 10px 10px -10px var(--color-tree-node-text);
}

.node.highlight--bottom {
  box-shadow: inset 0 -10px 10px -10px var(--color-tree-node-text);
}

.node.highlight--right {
  box-shadow: inset -10px 0 10px -10px var(--color-tree-node-text);
}

.node__content {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 0 4px;
}

.node__label {
  word-wrap: break-word;
  margin: 0;
  color: var(--color-tree-node-text);
  font-weight: 500;

  font-size: 14px;
  user-select: none;
  text-align: center;
  white-space: break-spaces;
}

.node.completed .node__label {
  opacity: 0.5;
  text-decoration: line-through;
}

.node__status {
  display: flex;
  align-items: flex-end;
  gap: 4px;
}

.node__status:empty {
  display: none;
}

.node__status__item {
  display: flex;
  align-items: center;
  gap: 2px;
  opacity: 0.7;
  color: var(--color-tree-node-text);
  font-size: 10px;
  user-select: none;
}

.node__status__item .icon {
  width: 10px;
  height: 10px;
}

.node__progress__text.overridden {
  fill: var(--color-info-background);
  color: var(--color-info-background);
}

.node__progress__bar {
  position: absolute;
  bottom: -4px;
  left: -1px;
  border-radius: 0 0 4px 4px;
  background-color: black;
  width: calc(100% + 2px);
  height: 3px;
  overflow: hidden;
}

.node__progress__fill {
  transition: width 1s ease;
  background-color: var(--color-success-background);
  height: 100%;
}

.node__editor__input {
  width: 100%;
  font-size: 14px;
}
</style>
